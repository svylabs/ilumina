# ilumina

A framework to test smart contracts.

## Key Concepts

### Actor

An actor is an agent / actor that acts on a set of smart contracts. For example: In a lending protocol, borrower is an Actor, Hacker could be an actor, and so on.

### Action

An actor can take one or more actions. In the same example: Borrow is an action, Repay is an action and so on.

### Contract

A set of smart contract that has to be tested.

### Simulation / Run

A simulation / run, creates the following

1. Deploys the contracts
2. Creates a set of actors with specific actions. The actions are assigned probabilities.
3. During each iteration of the simulation, each actor is executed, and they execute the action based on the probabilities configured.

## Usage

### Install

`npm install --save-dev @svylabs/ilumina`

### Scaffold tests

`npx @svylabs/ilumina scaffold`

This command should scaffold a basic test script that should be modified to suit your contracts.
