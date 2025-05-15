import { RunContext, Snapshot } from './run.js';
import { Actor } from './actor.js';
export declare abstract class Action {
    readonly name: string;
    constructor(name: string);
    log(...args: any[]): void;
    abstract generateExecutionParams(context: RunContext, actor: Actor, currentSnapshot: Snapshot): Promise<[any, Record<string, any>]>;
    abstract execute(context: RunContext, actor: Actor, currentSnapshot: Snapshot, actionParams: any): Promise<Record<string, any> | void>;
    abstract validate(context: RunContext, actor: Actor, previousSnapshot: Snapshot, newSnapshot: Snapshot, actionParams: any): Promise<boolean>;
}
//# sourceMappingURL=action.d.ts.map