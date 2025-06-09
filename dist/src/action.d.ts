import { RunContext, Snapshot } from './run.js';
import { Actor } from './actor.js';
export interface TxReceipt {
    txReceipt: any;
}
export declare abstract class Action {
    readonly name: string;
    constructor(name: string);
    log(...args: any[]): void;
    abstract initialize(context: RunContext, actor: Actor, currentSnapshot: Snapshot): Promise<[boolean, any, Record<string, any>]>;
    abstract execute(context: RunContext, actor: Actor, currentSnapshot: Snapshot, actionParams: any): Promise<TxReceipt>;
    abstract validate(context: RunContext, actor: Actor, previousSnapshot: Snapshot, newSnapshot: Snapshot, actionParams: any, txReceipt: TxReceipt): Promise<boolean>;
}
//# sourceMappingURL=action.d.ts.map