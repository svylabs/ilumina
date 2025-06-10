export class Action {
    name;
    hooks;
    constructor(name, actionHooks) {
        this.name = name;
        this.hooks = actionHooks || {};
    }
    log(...args) {
        console.log(JSON.stringify({
            run: JSON.stringify({
                time: new Date().toISOString(),
                actionName: this.name,
            }),
            args: JSON.stringify(args)
        }));
    }
    async _initialize(context, actor, currentSnapshot) {
        await this.hooks?.beforeInitialize?.(context, actor);
        const params = this.initialize(context, actor, currentSnapshot);
        await this.hooks?.afterInitialize?.(context, actor, params);
        return params;
    }
    async _execute(context, actor, currentSnapshot, actionParams) {
        await this.hooks?.beforeExecute?.(context, actor, actionParams);
        const executionReceipt = await this.execute(context, actor, currentSnapshot, actionParams);
        await this.hooks?.afterExecute?.(context, actor, currentSnapshot, actionParams, executionReceipt);
        return executionReceipt;
    }
    async _validate(context, actor, previousSnapshot, newSnapshot, actionParams, executionReceipt) {
        await this.hooks?.beforeValidate?.(context, actor, previousSnapshot, newSnapshot, actionParams, executionReceipt);
        const isValid = await this.validate(context, actor, previousSnapshot, newSnapshot, actionParams, executionReceipt);
        await this.hooks?.afterValidate?.(context, actor, previousSnapshot, newSnapshot, actionParams, executionReceipt, isValid);
        return isValid;
    }
}
