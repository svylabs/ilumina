import { Agent } from "flocc";
import { RunContext } from "./run.js";
import { Account } from "./account.js";
import { Action } from "./action.js";
export interface ActorConfig {
    readonly name: string;
    readonly account: Account;
    readonly actions: {
        action: Action;
        probability: number;
    }[];
}
export declare class Actor extends Agent {
    readonly actorType: string;
    readonly account: Account;
    private iteration;
    private actions;
    private identifiers;
    constructor(actorType: string, account: Account, contracts: any[], actions: {
        action: Action;
        probability?: number;
    }[], identifiers?: Record<string, any>);
    step(context: RunContext): Promise<void>;
    log(...args: any[]): void;
    getIdentifiers(): Record<string, any>;
    executeStep(context: RunContext): Promise<void>;
    executeAction(context: RunContext, action: Action): Promise<void>;
}
//# sourceMappingURL=actor.d.ts.map