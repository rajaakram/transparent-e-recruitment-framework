# Transparent e-Recruitment Framework

## Overview

This repository contains the implementation of a blockchain-based e-recruitment framework designed to enhance transparency, security, and fairness in the hiring process. The project is divided into three main components:

1. Credential Vault
2. CV Forge
3. Assessment Arena

Each component addresses specific challenges in the recruitment lifecycle, leveraging blockchain technology, smart contracts, and decentralized storage solutions.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Components](#components)
  - [Credential Vault](#credential-vault)
  - [CV Forge](#cv-forge)
  - [Assessment Arena](#assessment-arena)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- Secure and verifiable credential management
- Automated CV submission and evaluation
- Transparent shortlisting process
- Unbiased candidate assessment
- Blockchain-based data integrity and immutability
- Decentralized storage using IPFS
- Smart contract-driven processes

## Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Truffle Suite
- Ganache (for local blockchain development)
- MetaMask (for interacting with the Ethereum network)
- IPFS daemon

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/transparent-e-recruitment-framework.git
   cd transparent-e-recruitment-framework
   ```
2. Install dependencies for each component:
   ```sh
   cd credential-vault && npm install
   cd ../cv-forge && npm install
   cd ../assessment-arena && npm install
   ```
3. Set up your local blockchain using Ganache or connect to an Ethereum testnet.
4. Configure your MetaMask to connect to your chosen network.
5. Start the IPFS daemon:
   ```sh
   ipfs daemon
   ```

## Usage

For each component (Credential Vault, CV Forge, Assessment Arena):

1. Navigate to the component directory:
   ```sh
   cd component-name
   ```
2. Deploy the smart contracts:
   ```sh
   truffle migrate --reset
   ```
3. Start the development server:
   ```sh
   npm run start
   ```
4. Access the application through your web browser at the specified local port.

## Project Structure

```plaintext
transparent-e-recruitment-framework/
│
├── credential-vault/          # Credential Vault component
│   ├── contracts/             # Smart contract source files
│   ├── migrations/            # Truffle migration scripts
│   ├── test/                  # Test files for smart contracts
│   ├── client/                # Frontend application
│   │   ├── src/
│   │   └── public/
│   └── README.md              # Component-specific README
│
├── cv-forge/                  # CV Forge component
│   ├── contracts/
│   ├── migrations/
│   ├── test/
│   ├── client/
│   │   ├── src/
│   │   └── public/
│   └── README.md
│
├── assessment-arena/          # Assessment Arena component
│   ├── contracts/
│   ├── migrations/
│   ├── test/
│   ├── client/
│   │   ├── src/
│   │   └── public/
│   └── README.md
│
└── README.md                  # Main project README
```

## Components

### Credential Vault

The Credential Vault component manages the issuance, storage, and verification of academic and professional credentials. It utilizes IPFS for decentralized storage and Ethereum for creating non-fungible tokens (NFTs) representing verified credentials.

For detailed information, see the README in the `credential-vault/` directory.

### CV Forge

The CV Forge facilitates the creation, submission, and automated evaluation of CVs. It uses smart contracts to manage job postings and candidate applications, ensuring a transparent and fair shortlisting process.

For detailed information, see the README in the `cv-forge/` directory.

### Assessment Arena

The Assessment Arena handles candidate assessments, automated scoring, and feedback generation. It integrates with AI models to provide comprehensive and unbiased evaluations.

For detailed information, see the README in the `assessment-arena/` directory.

## Contributing

We welcome contributions to the Transparent e-Recruitment Framework! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

For any questions or concerns, please open an issue in this repository or contact the project maintainers:

- Elena Popova - [elena.popova@example.com](mailto:elena.popova@example.com)
- Alberto Rodriguez - [alberto.rodriguez@example.com](mailto:alberto.rodriguez@example.com)
- Mihail Beshkov - [mihail.beshkov@example.com](mailto:mihail.beshkov@example.com)
