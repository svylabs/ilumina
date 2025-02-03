import { Agent } from "flocc";

export class PRNG {
    private state: number;
  
    constructor(seed: string) {
      this.state = 1; // Default nonzero state
      this.initialize(seed);
    }
  
    private async initialize(seed: number | string): Promise<void> {
      this.state = typeof(seed) === 'number' ? seed : await this.sha256ToSeed(seed);
    }
  
    private async sha256ToSeed(seed: string): Promise<number> {
      const encoder = new TextEncoder();
      const data = encoder.encode(seed);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
  
      // Convert first 4 bytes of SHA-256 hash to a 32-bit integer
      return (
        (hashArray[0] << 24) |
        (hashArray[1] << 16) |
        (hashArray[2] << 8) |
        hashArray[3]
      ) >>> 0; // Ensure it's unsigned
    }
  
    next(): number {
      this.state |= 0;
      this.state = (this.state + 0x6D2B79F5) | 0;
      let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
  }
  

export interface Account {
   type: "key" | "contract",
   address: string,
   value: any // contract code or private key
}

export abstract class Action {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    log(...args: any[]) {
        console.log(JSON.stringify({
            run: JSON.stringify({
                time: new Date().toISOString(),
                actionName: this.name,
            }),
            args: JSON.stringify(args)
        }));
    }
    abstract execute(context: RunContext, actor: Actor, currentSnapshot: any): Promise<void>;
    abstract validate(context: RunContext, actor: Actor, previousSnapshot: any, newSnapshot: any, actionParams: any): Promise<boolean>;
}

export interface ActorConfig {
    name: string;
    account: Account;
    actions: { action: Action; probability: number }[];
}


export class Actor extends Agent {
    actorType: string;
    account: Account;
    iteration: number= 0;
    actions: { action: Action; probability?: number }[];
    constructor(actorType: string, account: Account, contracts: any[], actions: { action: Action; probability?: number }[]) {
        super();
        this.actorType = actorType;
        this.account = account;
        this.actions = actions;
    }

    async step(context: RunContext) {
        this.iteration = context.iter;
        await this.executeStep(context);
    }

    log(...args: any[]) {
        console.log(JSON.stringify({
            run: JSON.stringify({
                time: new Date().toISOString(),
                actorType: this.actorType,
                iteration: this.iteration,
                address: this.account.address,
            }),
            args: JSON.stringify(args)
        }));
    }

    async executeStep(context: RunContext) {
        this.iteration = context.iter;
        const result = this.actions.reduce(
            (acc, action) => {
                acc[0] += action.probability || 0; // Sum of probabilities
                acc[1] += action.probability ? 0 : 1; // Count of actions without probability
                return acc;
              }
              , [0, 0]
        );
        for (let action of this.actions) {
            if (action.probability) {
                if (context.prng.next() < action.probability / result[0]) {
                    this.executeAction(context, action.action);
                }
            } else {
                if (context.prng.next() < 1 / result[1]) {
                    this.executeAction(context, action.action);
                }
            }
        }
    }

    async executeAction(context: RunContext, action: Action) {
        let actionParams;
        let currentSnapshot;
        let newSnapshot;
        try {
            currentSnapshot = await context.snapshotProvider.snapshot();
            this.log("Executing action");
            actionParams = await action.execute(context, this, currentSnapshot);
            newSnapshot = await context.snapshotProvider.snapshot();
            this.log("Validating action", actionParams);
            await action.validate(context, this, currentSnapshot, newSnapshot, actionParams);
        } catch (ex) {
            this.log(ex, currentSnapshot, actionParams, newSnapshot);
            throw ex;
        }
    }
}

export interface Web3RunnerOptions {
    iterations: number;
    shuffleAgents?: boolean;
    randomSeed?: string;
}

export interface SnapshotProvider {
    snapshot(): Promise<any>;
}

export interface RunContext {
    snapshotProvider: SnapshotProvider;
    prng: PRNG;
    iter: number;
}

export class Runner {
    actors: Actor[];
    randomSeed: string;
    iterations: number;
    options: any;
    prng: PRNG;
    snapshotProvider: SnapshotProvider;
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