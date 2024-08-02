import "@nomicfoundation/hardhat-toolbox";

require('hardhat-abi-exporter');
require('dotenv').config({ path: './.env' }) 

module.exports = {
  solidity: {
    version:  "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      }
    }
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY]
    }
  },
  abiExporter: {
    path: './abi',
    runOnCompile: true,
    clear: true,
    flat: false,
    only: [],
    spacing: 2,
    format: "json",
  }
};

