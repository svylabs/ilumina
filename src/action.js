export class Action {
    name;
    constructor(name) {
        this.name = name;
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

    // Placeholder for generateActionParams
    async generateActionParams(context, actor, currentSnapshot) {
        throw new Error("generateActionParams must be implemented in subclasses");
    }

    async execute(context, actor, currentSnapshot, actionParams) {
        throw new Error("execute must be implemented in subclasses");
    }

    async validate(context, actor, previousSnapshot, newSnapshot, actionParams) {
        throw new Error("validate must be implemented in subclasses");
    }
}
