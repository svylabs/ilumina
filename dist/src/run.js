import { PRNG } from "./prng.js";
export class Runner {
    actors;
    randomSeed;
    iterations;
    options;
    prng;
    contracts;
    snapshotProvider;
    hooks;
    constructor(contracts, actors, snapshotProvider, options, hooks) {
        this.actors = actors;
        this.contracts = contracts;
        this.iterations = options.iterations || 100;
        this.randomSeed = options.randomSeed || "0";
        this.prng = new PRNG(options.randomSeed || "0");
        this.snapshotProvider = snapshotProvider;
        this.options = options;
        this.hooks = hooks || {};
    }
    async run() {
        for (let i = 1; i <= this.iterations; i++) {
            let context = {
                contracts: this.contracts,
                snapshotProvider: this.snapshotProvider,
                prng: this.prng,
                iter: i,
                allActors: this.actors
            };
            if (this.hooks?.beforeIteration) {
                this.hooks.beforeIteration(context);
            }
            if (this.options["shuffleAgents"]) {
                this.actors = this.actors.sort(() => this.prng.next() - 0.5);
            }
            for (let agent of this.actors) {
                if (this.hooks?.beforeActorStep) {
                    await this.hooks.beforeActorStep(context, agent);
                }
                await agent.step(context);
                if (this.hooks?.afterActorStep) {
                    await this.hooks.afterActorStep(context, agent);
                }
            }
            if (this.hooks?.afterIteration) {
                this.hooks.afterIteration(context);
            }
        }
    }
}
