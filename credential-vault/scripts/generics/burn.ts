import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import issue_abi from "../../abi/contracts/Issuance.sol/Issuance.json"
import { ethers } from "hardhat"

/*
    Burns (destroys) NFT with id supplied. Requires an already deployed issuance contract.
*/
async function burn(contract_address: string, signer: HardhatEthersSigner, NFT_id: BigInt){
    const issue = new ethers.Contract(contract_address, issue_abi, signer)
    await issue.burn(NFT_id) 
}

export { burn }