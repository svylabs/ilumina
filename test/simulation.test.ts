import { describe, test, expect } from "@jest/globals";
import { PRNG, Actor, Account, Action, Runner, Web3RunnerOptions, SnapshotProvider, RunContext } from "../src/index"; // Replace with actual file name

// ✅ 1. Mock Snapshot Provider
class MockSnapshotProvider implements SnapshotProvider {
    private state: any;
    constructor() {
        this.state = { balance: 1000 }; // Mock blockchain state
    }

    async snapshot(): Promise<any> {
        return JSON.parse(JSON.stringify(this.state)); // Return a copy of state
    }
}

// ✅ 2. Mock Action (e.g., Swapping Tokens)
class SwapTokensAction extends Action {
    constructor() {
        super("SwapTokens");
    }

    async execute(context: RunContext, actor: Actor, currentSnapshot: any): Promise<any> {
        actor.log("Swapping tokens...");
        return { swapAmount: 100 };
    }

    async validate(context: RunContext, actor: Actor, previousSnapshot: any, newSnapshot: any, actionParams: any): Promise<boolean> {
        actor.log("Validating swap...");
        return true; // Always succeeds
    }
}

// ✅ 3. Setup a Test Actor
const testAccount: Account = {
    type: "key",
    address: "0xTestAccount",
    value: "0xPrivateKey"
};

const swapAction = new SwapTokensAction();
const testActor = new Actor(
    "Trader",
    testAccount,
    [],
    [{ action: swapAction, probability: 0.8 }] // 80% probability of execution
);

// ✅ 4. Create a Runner and Execute Tests
const options: Web3RunnerOptions = {
    iterations: 5, // Run 5 iterations
    randomSeed: "test-seed", // Deterministic run
    shuffleAgents: false
};

const snapshotProvider = new MockSnapshotProvider();
const runner = new Runner([testActor], snapshotProvider, options);

describe("Simulation Tests", () => {
    it("Should run the simulation", async () => {
        await runner.run();
    });
});
