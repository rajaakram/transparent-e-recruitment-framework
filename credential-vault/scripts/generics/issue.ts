import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import issue_abi from "../../abi/contracts/Issuance.sol/Issuance.json"
import { ethers } from "hardhat"

/*
    Revokes NFT with id supplied. Requires an already deployed issuance contract.
*/
async function issue(contract_address: string, signer: HardhatEthersSigner, holder: HardhatEthersSigner, URI: string ){
    const issue = new ethers.Contract(contract_address, issue_abi, signer)
    const tx = await issue.create(holder, URI)
    const id = (await tx.wait()).logs[0].args[2]
    return { tx, id }
}

export { issue }