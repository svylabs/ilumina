import { Agent } from "flocc";
export declare class PRNG {
    private state;
    constructor(seed: string);
    private initialize;
    private sha256ToSeed;
    next(): number;
}
export interface Account {
    readonly type: "key" | "contract";
    readonly address: string;
    readonly value: any;
}
export declare abstract class Action {
    readonly name: string;
    constructor(name: string);
    log(...args: any[]): void;
    abstract execute(context: RunContext, actor: Actor, currentSnapshot: any): Promise<any>;
    abstract validate(context: RunContext, actor: Actor, previousSnapshot: any, newSnapshot: any, actionParams: any): Promise<boolean>;
}
export interface ActorConfig {
    readonly name: string;
    readonly account: Account;
    readonly actions: {
        action: Action;
        probability: number;
    }[];
}
export declare class Actor extends Agent {
    readonly actorType: string;
    readonly account: Account;
    private iteration;
    private actions;
    constructor(actorType: string, account: Account, contracts: any[], actions: {
        action: Action;
        probability?: number;
    }[]);
    step(context: RunContext): Promise<void>;
    log(...args: any[]): void;
    executeStep(context: RunContext): Promise<void>;
    executeAction(context: RunContext, action: Action): Promise<void>;
}
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
//# sourceMappingURL=index.d.ts.map