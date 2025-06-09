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
export declare class Runner {
    actors: Actor[];
    readonly randomSeed: string;
    readonly iterations: number;
    readonly options: any;
    readonly prng: PRNG;
    readonly contracts: Record<string, any>;
    readonly snapshotProvider: SnapshotProvider;
    readonly hooks: Hooks;
    constructor(contracts: Record<string, any>, actors: Actor[], snapshotProvider: SnapshotProvider, options: Web3RunnerOptions, hooks?: Hooks);
    run(): Promise<void>;
}
//# sourceMappingURL=run.d.ts.map