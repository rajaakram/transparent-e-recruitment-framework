import { ethers } from "hardhat";
import verify_abi from "../../abi/contracts/Verification.sol/Verification.json"

async function main() {
    var [issuer] = await ethers.getSigners()
    // issuer is the owner by default
    const issue = await ethers.deployContract("Issuance", {
    });
    await issue.waitForDeployment();
    const issue_address = await issue.getAddress()
    // get verify contract address through the issue contract, since it is deployed through it
    const verify_address = await issue.verify_contract();
    // get the contract from network with issuer as signer
    const verify = new ethers.Contract(verify_address, verify_abi, issuer)
    // get the issue contract address via the verify contract
    const issue_address_from_verify = await verify.issue_contract()
    // log used as visual feedback, also to check that addresses match
    console.log(
      `Issue deployed to ${issue_address}, with owner at ${issuer.address}
Verify deployed to ${verify_address}, with linked issue contract at ${issue_address_from_verify}`
    )
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});