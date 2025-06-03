import { Agent } from "flocc";
export class Actor extends Agent {
    actorType;
    account;
    iteration = 0;
    actions;
    identifiers = {};
    constructor(actorType, account, actions, identifiers = {}) {
        super();
        this.actorType = actorType;
        this.account = account;
        this.actions = actions;
        this.identifiers = identifiers;
        this.identifiers["accountAddress"] = account.address; // Set initial identifier
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
    getIdentifiers() {
        return { ...this.identifiers };
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
            }
            else {
                if (context.prng.next() < 1 / result[1]) {
                    await this.executeAction(context, action.action);
                }
            }
        }
    }
    async executeAction(context, action) {
        let executionParams;
        let currentSnapshot;
        let newSnapshot;
        let updatedIdentifiers;
        try {
            currentSnapshot = await context.snapshotProvider.snapshot();
            // Generate action parameters for the action
            [executionParams, updatedIdentifiers] = await action.initialize(context, this, currentSnapshot);
            // Execute the action with the generated parameters
            this.log("Executing action", action, " with ", executionParams);
            await action.execute(context, this, currentSnapshot, executionParams);
            // Update identifiers if returned by the action
            if (updatedIdentifiers) {
                this.identifiers = { ...this.identifiers, ...updatedIdentifiers };
            }
            // Take the new snapshot
            newSnapshot = await context.snapshotProvider.snapshot();
            // Validate the action
            this.log("Validating action", action, executionParams);
            await action.validate(context, this, currentSnapshot, newSnapshot, executionParams);
        }
        catch (ex) {
            this.log(ex, action, currentSnapshot, executionParams, newSnapshot);
            throw ex;
        }
    }
}
