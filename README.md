# ilumina

A framework to test smart contracts.

## Key Concepts

### Actor

An actor is an agent / actor that acts on a set of smart contracts. For example: In a lending protocol, borrower is an Actor, Hacker could be an actor, and so on.

### Action

An actor can take one or more actions. In the same example: Borrow is an action, Repay is an action and so on.

### Contract

A set of smart contracts that has to be tested.

### Simulation / Run

A simulation / run requires the following

1. How the contracts should be deployed in (contracts/deploy.ts).
2. A SnapshotProvider has to be implemented that can take a snapshot of the contracts.
3. Implementors have to create a list of actors with specific actions. The actions are assigned probabilities.
4. An implementation of action
   - `execute` method for the action, that should return the actionParams: could be the parameters, outputs, etc.
   - `validate` method to check if the action was successfully executed / failed. Two snapshots(previous and current) and actionParams will be provided to check if the state was valid.

The simulation script ensures that for each iteration of the simulation, each actor is executed, and they execute the action based on the probabilities configured.

## Usage

### Install

`npm install --save-dev @svylabs/ilumina`

### Scaffold tests

`npx @svylabs/ilumina scaffold`

This command should scaffold a basic test script that should be modified to suit your contracts.
