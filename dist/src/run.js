import { PRNG } from "./prng.js";
export class Runner {
    actors;
    randomSeed;
    iterations;
    options;
    prng;
    snapshotProvider;
    constructor(actors, snapshotProvider, options) {
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
