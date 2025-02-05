#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var path = require("path");
var fse = require("fs-extra");
var program = new commander_1.Command();
program
    .version("1.0.0")
    .option("-f, --framework <framework>", "Development framework (hardhat, foundry)", "hardhat")
    .option("-l, --language <language>", "Programming language (ts, js)", "ts")
    .action(function (options) {
    var testDir = path.resolve(process.cwd(), "simulation");
    var testFile = path.join(testDir, "simulation.".concat(options.language));
    var template = "#!/usr/bin/env node\nimport { PRNG, Actor, Account, Action, Runner, Web3RunnerOptions, SnapshotProvider, RunContext, Agent, Environment } from \"@svylabs/flocc-ext\";\nimport { ethers } from \"hardhat\";\n\nasync function deployContracts() {\n    const [deployer] = await ethers.getSigners();\n    const contracts = {};\n    // Deploy all required contracts here and add them to the mapping.\n    // Return the contracts map\n    return contracts;\n}\n\n// Define your custom Actions here\nclass BorrowAction extends Action {\n    private contracts: any;\n    constructor(contracts: any) {\n        super(\"Borrow\");\n    }\n\n    async execute(context: RunContext, actor: Actor, currentSnapshot: any): Promise<any> {\n        actor.log(\"Borrowing...\");\n        return { borrowAmount: 100 };\n    }\n\n    async validate(context: RunContext, actor: Actor, previousSnapshot: any, newSnapshot: any, actionParams: any): Promise<boolean> {\n        actor.log(\"Validating borrow...\");\n        return true; // Always succeeds\n    }\n}\n\n// Define SnapshotProvider here\nclass ContractSnapshotProvider implements SnapshotProvider {\n    private contracts: any;\n    constructor(contracts: any) {\n        this.contracts = contracts;\n    }\n    async snapshot(): Promise<any> {\n        // Take snapshots of all contracts here\n    }\n}\n\nasync function main() {\n    \n    const contracts = await deployContracts();\n    const addrs = await ethers.getSigners();\n\n    const env = new Environment();\n\n    // Define Actors here\n    const numActors = 10;\n    const actors: Actor[] = [];\n    for (let i = 0; i < numActors; i++) {\n        const account = {\n           address: addrs[i].address,\n           type: \"key\",\n           value: addrs[i]\n        }\n        // Pass only the required contract instead of passing all contracts\n        const borrowAction = new BorrowAction(contracts);\n        const actor = new Actor(\n            \"Borrower\",\n            account,\n            [],\n            [{ action: borrowAction, probability: 0.8 }] // 80% probability\n        );\n        actors.push(actor);\n        env.addAgent(actor);\n   }\n\n    // Configure a Runner\n\n    // Initialize and run simulation\n    const options = {\n        iterations: 10,\n        randomSeed: \"test-seed\",\n        shuffleAgents: false\n    };\n\n    const snapshotProvider = new ContractSnapshotProvider(contracts);\n\n    const runner = new Runner(actors, snapshotProvider, options);\n    await runner.run();\n}\n\nconsole.log(process.argv);\ndescribe(\"Simulation\", function() {\n    it(\"Should run the simulation without errors\", async function() {\n        this.timeout(1000000);\n        await main();\n    });\n});\n    \n    ";
    fse.ensureDirSync(testDir);
    //console.log(fs);
    fse.outputFile(testFile, template);
    console.log("\u2705 Test scaffolded: ".concat(testFile));
});
program.parse(process.argv);
