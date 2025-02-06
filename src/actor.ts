import { Agent } from "flocc";
import { RunContext } from "./run.js";
import { Account } from "./account.js";
import { Action } from "./action.js";

  

export interface ActorConfig {
    readonly name: string;
    readonly account: Account;
    readonly actions: { action: Action; probability: number }[];
}



export class Actor extends Agent {
    readonly actorType: string;
    readonly account: Account;
    private iteration: number= 0;
    private actions: { action: Action; probability?: number }[];
    constructor(actorType: string, account: Account, contracts: any[], actions: { action: Action; probability?: number }[]) {
        super();
        this.actorType = actorType;
        this.account = account;
        this.actions = actions;
    }

    async step(context: RunContext) {
        this.iteration = context.iter;
        await this.executeStep(context);
    }

    log(...args: any[]) {
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

    async executeStep(context: RunContext) {
        this.iteration = context.iter;
        const result = this.actions.reduce(
            (acc, action) => {
                acc[0] += action.probability || 0; // Sum of probabilities
                acc[1] += action.probability ? 0 : 1; // Count of actions without probability
                return acc;
              }
              , [0, 0]
        );
        for (let action of this.actions) {
            if (action.probability) {
                if (context.prng.next() < action.probability / result[0]) {
                    this.executeAction(context, action.action);
                }
            } else {
                if (context.prng.next() < 1 / result[1]) {
                    this.executeAction(context, action.action);
                }
            }
        }
    }

    async executeAction(context: RunContext, action: Action) {
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
        } catch (ex) {
            this.log(ex, action, currentSnapshot, actionParams, newSnapshot);
            throw ex;
        }
    }
}