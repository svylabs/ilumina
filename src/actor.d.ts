import { Agent } from "flocc";
import { RunContext } from "./run";
import { Account } from "./account";
import { Action } from "./action";
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
    constructor(actorType: string, account: Account, contracts: any[], actions: {
        action: Action;
        probability?: number;
    }[]);
    step(context: RunContext): Promise<void>;
    log(...args: any[]): void;
    executeStep(context: RunContext): Promise<void>;
    executeAction(context: RunContext, action: Action): Promise<void>;
}
//# sourceMappingURL=actor.d.ts.map