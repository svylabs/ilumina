#!/usr/bin/env node
import { Command } from "commander";
import * as path from "path";
import * as fse from "fs-extra";
const program = new Command();
program
    .version("0.1.0")
    .option("-f, --framework <framework>", "Development framework (hardhat, foundry)", "hardhat")
    .option("-l, --language <language>", "Programming language (ts, js)", "ts")
    .action((options) => {
    const testDir = path.resolve(process.cwd(), "simulation");
    const testFile = path.join(testDir, `simulation.${options.language}`);
    const template = `#!/usr/bin/env node
import { PRNG, Actor, Action, Runner, Agent, Environment } from "@svylabs/ilumina";
import type { Account, Web3RunnerOptions, SnapshotProvider, RunContext } from "@svylabs/ilumina";
import {ethers} from 'hardhat';

async function deployContracts() {
    const [deployer] = await ethers.getSigners();
    const contracts = {};
    // Deploy all required contracts here and add them to the mapping.
    // Return the contracts map
    return contracts;
}

// Define your custom Actions here
class BorrowAction extends Action {
    private contracts: any;
    constructor(contracts: any) {
        super("Borrow");
    }

    async execute(context: RunContext, actor: Actor, currentSnapshot: any): Promise<any> {
        actor.log("Borrowing...");
        return { borrowAmount: 100 };
    }

    async validate(context: RunContext, actor: Actor, previousSnapshot: any, newSnapshot: any, actionParams: any): Promise<boolean> {
        actor.log("Validating borrow...");
        return true; // Always succeeds
    }
}

// Define SnapshotProvider here
class ContractSnapshotProvider implements SnapshotProvider {
    private contracts: any;
    constructor(contracts: any) {
        this.contracts = contracts;
    }
    async snapshot(): Promise<any> {
        // Take snapshots of all contracts here
    }
}

async function main() {
    
    const contracts = await deployContracts();
    const addrs = await ethers.getSigners();

    const env = new Environment();

    // Define Actors here
    const numActors = 10;
    const actors: Actor[] = [];
    for (let i = 0; i < numActors; i++) {
        const account: Account = {
           address: addrs[i].address,
           type: "key",
           value: addrs[i]
        }
        // Pass only the required contract instead of passing all contracts
        const borrowAction = new BorrowAction(contracts);
        const actor = new Actor(
            "Borrower",
            account,
            [],
            [{ action: borrowAction, probability: 0.8 }] // 80% probability
        );
        actors.push(actor);
        env.addAgent(actor);
   }

    // Configure a Runner

    // Initialize and run simulation
    const options = {
        iterations: 10,
        randomSeed: "test-seed",
        shuffleAgents: false
    };

    const snapshotProvider = new ContractSnapshotProvider(contracts);

    const runner = new Runner(actors, snapshotProvider, options);
    await runner.run();
}

console.log(process.argv);
main()
.then(() => {
    console.log("Simulation completed successfully");
    process.exit(0)
})
.catch(error => {
    console.error(error);
    process.exit(1);
});
    
    
    `;
    fse.ensureDirSync(testDir);
    //console.log(fs);
    fse.outputFile(testFile, template);
    console.log(`✅ Test scaffolded: ${testFile}`);
});
program.parse(process.argv);
