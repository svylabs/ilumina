import { Agent } from "flocc";

export class Actor extends Agent {
    actorType;
    account;
    iteration = 0;
    actions;
    identifiers; // Map to hold identifiers

    constructor(actorType, account, actions, identifiers = new Map()) {
        super();
        this.actorType = actorType;
        this.account = account;
        this.actions = actions;
        this.identifiers = identifiers; // Initialize identifiers
        this.identifiers.set(account.address, account.address); // Set initial identifier
    }

    async step(context) {
        this.iteration = context.iter;
        await this.executeStep(context);
    }

    log(...args) {
        console.log(JSON.stringify({
            run: JSON.stringify({
                time: new Date().toISOString(),
                actorType: this.actorType,
                id: this.id,
                iteration: this.iteration,
                address: this.account.address,
            }),
            args: JSON.stringify(args)
        }));
    }

    async executeStep(context) {
        this.iteration = context.iter;
        const result = this.actions.reduce((acc, action) => {
            acc[0] += action.probability || 0; // Sum of probabilities
            acc[1] += action.probability ? 0 : 1; // Count of actions without probability
            return acc;
        }, [0, 0]);
        for (let action of this.actions) {
            if (action.probability) {
                if (context.prng.next() < action.probability / result[0]) {
                    await this.executeAction(context, action.action);
                }
            } else {
                if (context.prng.next() < 1 / result[1]) {
                    await this.executeAction(context, action.action);
                }
            }
        }
    }

    async executeAction(context, action) {
        let actionParams;
        let currentSnapshot;
        let newSnapshot;
        try {
            // Generate action parameters and update identifiers
            [actionParams, this.identifiers] = this.generateActionParams(action, this.account.address, this.identifiers);
            
            // Create snapshots based on updated identifiers
            currentSnapshot = await context.snapshotProvider.snapshot(Object.fromEntries(this.identifiers));
            this.log("Executing action", action);
            actionParams = await action.execute(context, this, currentSnapshot);
            newSnapshot = await context.snapshotProvider.snapshot(Object.fromEntries(this.identifiers));
            this.log("Validating action", action, actionParams);
            await action.validate(context, this, currentSnapshot, newSnapshot, actionParams);
        } catch (ex) {
            this.log(ex, action, currentSnapshot, actionParams, newSnapshot);
            throw ex;
        }
    }

    generateActionParams(action, accountAddress, identifiers) {
        const updatedIdentifiers = new Map(identifiers); // Create a copy of the identifiers

        const newSafeId = `safe-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`; // Generate a new safe ID
        updatedIdentifiers.set(newSafeId, newSafeId); // Add the new safe ID to the identifiers

        // Generate action parameters based on the action
        const actionParams = {
            // Populate with necessary parameters for the action
            safeId: newSafeId,
            // Add other parameters as needed
        };

        return [actionParams, updatedIdentifiers];
    }
}
