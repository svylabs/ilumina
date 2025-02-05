import { Actor } from "./actor";
import { PRNG } from "./prng";

export interface Web3RunnerOptions {
    readonly iterations: number;
    readonly shuffleAgents?: boolean;
    readonly randomSeed?: string;
}

export interface SnapshotProvider {
    snapshot(): Promise<any>;
}


export interface RunContext {
    readonly snapshotProvider: SnapshotProvider;
    readonly prng: PRNG;
    readonly iter: number;
}

export class Runner {
    actors: Actor[];
    readonly randomSeed: string;
    readonly iterations: number;
    readonly options: any;
    readonly prng: PRNG;
    readonly snapshotProvider: SnapshotProvider;
    constructor(actors: Actor[], snapshotProvider: SnapshotProvider, options: Web3RunnerOptions) {
        this.actors = actors;
        this.iterations = options.iterations || 100;
        this.randomSeed = options.randomSeed || "0";
        this.prng = new PRNG(options.randomSeed || "0");
        this.snapshotProvider = snapshotProvider;
        this.options = options;
    }

    async run() {
        for (let i = 1; i <= this.iterations; i++) {
            let context: RunContext = {
                snapshotProvider: this.snapshotProvider,
                prng: this.prng,
                iter: i
            }
            if (this.options["shuffleAgents"]) {
                this.actors = this.actors.sort(() => this.prng.next() - 0.5);
            }
            for (let agent of this.actors) {
                await agent.step(context);
            }
        }
    }

}