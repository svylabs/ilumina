import { Actor } from "./actor.js";
import { PRNG } from "./prng.js";

export interface Web3RunnerOptions {
    readonly iterations: number;
    readonly shuffleAgents?: boolean;
    readonly randomSeed?: string;
}

export interface Snapshot {
    readonly contractSnapshot: Record<string, any>;
    readonly accountSnapshot: Record<string, bigint>;
}

export interface SnapshotProvider {
    snapshot(): Promise<Snapshot>;
}


export interface RunContext {
    readonly contracts: Record<string, any>;
    readonly snapshotProvider: SnapshotProvider;
    readonly prng: PRNG;
    readonly iter: number;
    readonly allActors: Actor[];
}

export interface Hooks {
    beforeIteration?(context: RunContext): Promise<void>;
    afterIteration?(context: RunContext): Promise<void>;
    beforeActorStep?(context: RunContext, actor: Actor): Promise<void>;
    afterActorStep?(context: RunContext, actor: Actor): Promise<void>;
}

export class Runner {
    actors: Actor[];
    readonly randomSeed: string;
    readonly iterations: number;
    readonly options: any;
    readonly prng: PRNG;
    readonly contracts: Record<string, any>;
    readonly snapshotProvider: SnapshotProvider;
    readonly hooks: Hooks;
    constructor(contracts: Record<string, any>, actors: Actor[], snapshotProvider: SnapshotProvider, options: Web3RunnerOptions, hooks?: Hooks) {
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
            let context: RunContext = {
                contracts: this.contracts,
                snapshotProvider: this.snapshotProvider,
                prng: this.prng,
                iter: i,
                allActors: this.actors
            }
            if (this.hooks?.beforeIteration) {
                await this.hooks.beforeIteration(context);
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
                await this.hooks.afterIteration(context);
            }
        }
    }

}