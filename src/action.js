export class Action {
    constructor(name) {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
}
