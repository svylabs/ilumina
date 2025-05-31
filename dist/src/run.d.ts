import { Actor } from "./actor.js";
import { PRNG } from "./prng.js";
export interface Web3RunnerOptions {
    readonly iterations: number;
    readonly shuffleAgents?: boolean;
    readonly randomSeed?: string;
}
export interface Snapshot {
    readonly contractSnapshot: Record<string, any>;
}
export interface SnapshotProvider {
    snapshot(): Promise<Snapshot>;
}
export interface RunContext {
    readonly snapshotProvider: SnapshotProvider;
    readonly prng: PRNG;
    readonly iter: number;
    readonly allActors: Actor[];
}
export declare class Runner {
    actors: Actor[];
    readonly randomSeed: string;
    readonly iterations: number;
    readonly options: any;
    readonly prng: PRNG;
    readonly snapshotProvider: SnapshotProvider;
    constructor(actors: Actor[], snapshotProvider: SnapshotProvider, options: Web3RunnerOptions);
    run(): Promise<void>;
}
//# sourceMappingURL=run.d.ts.map