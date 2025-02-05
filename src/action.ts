import { RunContext } from './run';
import { Actor } from './actor';

export abstract class Action {
    readonly name: string;
    constructor(name: string) {
        this.name = name;
    }
    log(...args: any[]) {
        console.log(JSON.stringify({
            run: JSON.stringify({
                time: new Date().toISOString(),
                actionName: this.name,
            }),
            args: JSON.stringify(args)
        }));
    }
    abstract execute(context: RunContext, actor: Actor, currentSnapshot: any): Promise<any>;
    abstract validate(context: RunContext, actor: Actor, previousSnapshot: any, newSnapshot: any, actionParams: any): Promise<boolean>;
}
