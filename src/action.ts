import { RunContext, Snapshot } from './run.js';
import { Actor } from './actor.js';

export interface ExecutionReceipt {
    receipt: any; // Transaction receipt
}

export interface ActionHooks {
    beforeInitialize?(context: RunContext, actor: Actor): Promise<void>;
    afterInitialize?(context: RunContext, actor: Actor, actionParams: any): Promise<void>;
    beforeExecute?(context: RunContext, actor: Actor, actionParams: any): Promise<void>;
    afterExecute?(context: RunContext, actor: Actor, currentSnapshot: Snapshot, actionParams: any, executionReceipt: ExecutionReceipt): Promise<void>;
    beforeValidate?(context: RunContext, actor: Actor, previousSnapshot: Snapshot, newSnapshot: Snapshot, actionParams: any, executionReceipt: ExecutionReceipt): Promise<void>;
    afterValidate?(context: RunContext, actor: Actor,  previousSnapshot: Snapshot, newSnapshot: Snapshot, actionParams: any, executionReceipt: ExecutionReceipt, isValid: boolean): Promise<void>;
}

export abstract class Action {
    readonly name: string;
    readonly hooks: ActionHooks;
    constructor(name: string, actionHooks?: ActionHooks) {
        this.name = name;
        this.hooks = actionHooks || {};
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

    async _initialize(
        context: RunContext,
        actor: Actor,
        currentSnapshot: Snapshot
    ): Promise<[boolean, any, Record<string, any>]> {
        await this.hooks?.beforeInitialize?.(context, actor);
        const params = this.initialize(context, actor, currentSnapshot);
        await this.hooks?.afterInitialize?.(context, actor, params);
        return params;
    }

    // Abstract method to generate action parameters
    abstract initialize(
        context: RunContext,
        actor: Actor,
        currentSnapshot: Snapshot
    ): Promise<[boolean, any, Record<string, any>]>;

    async _execute(
        context: RunContext,
        actor: Actor,
        currentSnapshot: Snapshot,
        actionParams: any
    ): Promise<ExecutionReceipt> {
        await this.hooks?.beforeExecute?.(context, actor, actionParams);
        const executionReceipt = await this.execute(context, actor, currentSnapshot, actionParams);
        await this.hooks?.afterExecute?.(context, actor, currentSnapshot, actionParams, executionReceipt);
        return executionReceipt;
    }

    // Abstract method to execute the action
    abstract execute(
        context: RunContext,
        actor: Actor,
        currentSnapshot: Snapshot,
        actionParams: any
    ): Promise<ExecutionReceipt>;

    async _validate(
        context: RunContext,
        actor: Actor,
        previousSnapshot: Snapshot,
        newSnapshot: Snapshot,
        actionParams: any,
        executionReceipt: ExecutionReceipt
    ): Promise<boolean> {
        await this.hooks?.beforeValidate?.(context, actor, previousSnapshot, newSnapshot, actionParams, executionReceipt);
        const isValid = await this.validate(context, actor, previousSnapshot, newSnapshot, actionParams, executionReceipt);
        await this.hooks?.afterValidate?.(context, actor, previousSnapshot, newSnapshot, actionParams, executionReceipt, isValid);
        return isValid;
    }

    // Abstract method to validate the action
    abstract validate(
        context: RunContext,
        actor: Actor,
        previousSnapshot: Snapshot,
        newSnapshot: Snapshot,
        actionParams: any,
        executionReceipt: ExecutionReceipt
    ): Promise<boolean>;
}
