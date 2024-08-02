# Verifiable Credentials with DLT and IPFS

This project outlines a smart contract based approach towards verifiable credential issuance and verification using DLT and NFTs.

You can find this project on [GitHub](https://github.com/Litolo/VC-DLT-Honours).

## Project Structure

Contract source code is located in the [contracts/](contracts/) folder

Generic scripts for contract deployment and interaction are located in the [scripts/generics/](scripts/generics/) folder

Tests are located in the [test/](test/)

The project includes a demonstration of a sample use case of the system. The python scripts to run the demo are included in a jupyter notebook file [demo.ipynb](demo.ipynb). Scripts run within the demo are found in the [scripts/demo/](scripts/demo/) folder.

## Requirements
Users must have [Node.js](https://nodejs.org/) and node package manager [(npm)](https://www.npmjs.com/) to run scripts relating to the project. Installation instructions are located [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

To run the demo for the project, users must have [python](https://www.python.org/) and the package manager [pip](https://pip.pypa.io/) installed. Users must also be able to run the jupyter notebook file by installing [Jupyter](https://jupyter.org/).

## Usage

The project files are designed to be run directly from the command line.

First install node dependencies.
```bash
npm install
```
Next, compile the smart contract source code.
```bash
npx hardhat compile
```

Lastly, deploy the contracts. You can configure the network which it is deployed on with the --network file. Make sure to configure the network information in the [hardhat.config.ts](hardhat.config.ts) file. A few examples are listed below.
```bash
npx hardhat run scripts/demo/deploy.ts
```
```bash
npx hardhat run scripts/demo/deploy.ts --network sepolia
```

The project supplies generic functions for contract interaction under the [scripts/generics/](scripts/generics/) folder. A demonstration of each script is included in the [demo.ipynb](demo.ipynb) jupyter notebook file. Please keep in mind that interaction with the Sepolia network and interplanetary file system require external API access. While not necessary for smart contract interaction of the system, for full demo you will need to sign up for accounts for the endpoint providers.

If you wish to do so, create a .env file in the root directory of the project containing the keys for API access. This project uses [Pinata](https://www.pinata.cloud/) for IPFS access and [Infura](https://www.infura.io/) for the Sepolia endpoint. You may wish to use other providers, however you will need to modify your [config file](hardhat.config.ts) and change urls in IPFS [upload](scripts/generics/upload.ts) and [fetch](scripts/generics/fetch.ts) scripts appropriately for your providers. You may find it useful to have a digital wallet to manage your private keys for different networks, as this project does for the Sepolia network. Some common wallet providers are [Coinbase](https://www.coinbase.com/wallet) or [Metamask](https://metamask.io/). Shown below is the .env format used, in case you want to configure your project to work with no additional edits.
```.env
GATEWAY_URL=[your dedicated IPFS gateway URL]
GATEWAY_TOKEN=[your dedicated IPFS gateway token]
PINATA_API_KEY=[your Pinata API key]
INFURA_API_KEY=[your Infura API key]
SEPOLIA_PRIVATE_KEY=[your Sepolia private key from your wallet]
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

