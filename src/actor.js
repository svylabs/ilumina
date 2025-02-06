"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actor = void 0;
const flocc_1 = require("flocc");
class Actor extends flocc_1.Agent {
    constructor(actorType, account, contracts, actions) {
        super();
        Object.defineProperty(this, "actorType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "account", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "iteration", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "actions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.actorType = actorType;
        this.account = account;
        this.actions = actions;
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
                    this.executeAction(context, action.action);
                }
            }
            else {
                if (context.prng.next() < 1 / result[1]) {
                    this.executeAction(context, action.action);
                }
            }
        }
    }
    async executeAction(context, action) {
        let actionParams;
        let currentSnapshot;
        let newSnapshot;
        try {
            currentSnapshot = await context.snapshotProvider.snapshot();
            this.log("Executing action", action);
            actionParams = await action.execute(context, this, currentSnapshot);
            newSnapshot = await context.snapshotProvider.snapshot();
            this.log("Validating action", action, actionParams);
            await action.validate(context, this, currentSnapshot, newSnapshot, actionParams);
        }
        catch (ex) {
            this.log(ex, action, currentSnapshot, actionParams, newSnapshot);
            throw ex;
        }
    }
}
exports.Actor = Actor;
