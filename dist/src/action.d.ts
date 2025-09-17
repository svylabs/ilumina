import { RunContext, Snapshot } from './run.js';
import { Actor } from './actor.js';
export interface ExecutionReceipt {
    receipt: any;
}
export interface ActionHooks {
    beforeInitialize?(context: RunContext, actor: Actor): Promise<void>;
    afterInitialize?(context: RunContext, actor: Actor, actionParams: any): Promise<void>;
    beforeExecute?(context: RunContext, actor: Actor, actionParams: any): Promise<void>;
    afterExecute?(context: RunContext, actor: Actor, currentSnapshot: Snapshot, actionParams: any, executionReceipt: ExecutionReceipt): Promise<void>;
    beforeValidate?(context: RunContext, actor: Actor, previousSnapshot: Snapshot, newSnapshot: Snapshot, actionParams: any, executionReceipt: ExecutionReceipt): Promise<void>;
    afterValidate?(context: RunContext, actor: Actor, previousSnapshot: Snapshot, newSnapshot: Snapshot, actionParams: any, executionReceipt: ExecutionReceipt, isValid: boolean): Promise<void>;
}
export declare abstract class Action {
    readonly name: string;
    readonly hooks: ActionHooks;
    constructor(name: string, actionHooks?: ActionHooks);
    log(...args: any[]): void;
    _initialize(context: RunContext, actor: Actor, currentSnapshot: Snapshot): Promise<[boolean, any, Record<string, any>]>;
    abstract initialize(context: RunContext, actor: Actor, currentSnapshot: Snapshot): Promise<[boolean, any, Record<string, any>]>;
    _execute(context: RunContext, actor: Actor, currentSnapshot: Snapshot, actionParams: any): Promise<ExecutionReceipt>;
    abstract execute(context: RunContext, actor: Actor, currentSnapshot: Snapshot, actionParams: any): Promise<ExecutionReceipt>;
    _validate(context: RunContext, actor: Actor, previousSnapshot: Snapshot, newSnapshot: Snapshot, actionParams: any, executionReceipt: ExecutionReceipt): Promise<boolean>;
    abstract validate(context: RunContext, actor: Actor, previousSnapshot: Snapshot, newSnapshot: Snapshot, actionParams: any, executionReceipt: ExecutionReceipt): Promise<boolean>;
}
//# sourceMappingURL=action.d.ts.map