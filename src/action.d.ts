import { RunContext } from './run';
import { Actor } from './actor';
export declare abstract class Action {
    readonly name: string;
    constructor(name: string);
    log(...args: any[]): void;
    abstract execute(context: RunContext, actor: Actor, currentSnapshot: any): Promise<any>;
    abstract validate(context: RunContext, actor: Actor, previousSnapshot: any, newSnapshot: any, actionParams: any): Promise<boolean>;
}
//# sourceMappingURL=action.d.ts.map