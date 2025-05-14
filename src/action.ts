import { RunContext } from './run.js';
import { Actor } from './actor.js';

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

    // Abstract method to generate action parameters
    abstract generateActionParams(
        context: RunContext,
        actor: Actor,
        currentSnapshot: any,
        identifiers: Record<string, any>
    ): Promise<[any, Record<string, any>?]>;

    // Abstract method to execute the action
    abstract execute(
        context: RunContext,
        actor: Actor,
        currentSnapshot: any,
        actionParams: any
    ): Promise<Record<string, any> | void>;

    // Abstract method to validate the action
    abstract validate(
        context: RunContext,
        actor: Actor,
        previousSnapshot: any,
        newSnapshot: any,
        actionParams: any
    ): Promise<boolean>;
}
