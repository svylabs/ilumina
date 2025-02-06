import { PRNG } from "./prng";
export class Runner {
    constructor(actors, snapshotProvider, options) {
        Object.defineProperty(this, "actors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "randomSeed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "iterations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "prng", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "snapshotProvider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.actors = actors;
        this.iterations = options.iterations || 100;
        this.randomSeed = options.randomSeed || "0";
        this.prng = new PRNG(options.randomSeed || "0");
        this.snapshotProvider = snapshotProvider;
        this.options = options;
    }
    async run() {
        for (let i = 1; i <= this.iterations; i++) {
            let context = {
                snapshotProvider: this.snapshotProvider,
                prng: this.prng,
                iter: i
            };
            if (this.options["shuffleAgents"]) {
                this.actors = this.actors.sort(() => this.prng.next() - 0.5);
            }
            for (let agent of this.actors) {
                await agent.step(context);
            }
        }
    }
}
