import { RunContext } from './run.js';
import { Actor } from './actor.js';
export declare abstract class Action {
    readonly name: string;
    constructor(name: string);
    log(...args: any[]): void;
    abstract generateActionParams(context: RunContext, actor: Actor, currentSnapshot: any, identifiers: Record<string, any>): Promise<[any, Record<string, any>?]>;
    abstract execute(context: RunContext, actor: Actor, currentSnapshot: any, actionParams: any): Promise<Record<string, any> | void>;
    abstract validate(context: RunContext, actor: Actor, previousSnapshot: any, newSnapshot: any, actionParams: any): Promise<boolean>;
}
//# sourceMappingURL=action.d.ts.map