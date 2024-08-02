import { Signer } from "ethers";
import issue_abi from "../../abi/contracts/Issuance.sol/Issuance.json"
import { ethers } from "hardhat"

/*
    Suspends NFT with id supplied. Requires an already deployed issuance contract.
*/
async function suspend(contract_address: string, signer: Signer, NFT_id: BigInt, reason: string = "" ){
    const issue = new ethers.Contract(contract_address, issue_abi, signer)
    const tx = await issue.suspend(NFT_id, reason) 
    return tx
}

export { suspend }