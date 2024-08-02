import { ethers } from "hardhat";
var fs = require('fs');
import verify_abi from "../../abi/contracts/Verification.sol/Verification.json"

async function main() {
    // note: credential fields cannot be empty, if you wish to send "no information" you instead send
    // an empty string or empty array of objects for entitlements. This is relevant when sending keys for credential decryption
    var [issuer, holder1, holder2] = await ethers.getSigners()
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
    // write to file for use in the credential json
    if (holder1 == undefined){
      fs.writeFile('sample/addresses.json', JSON.stringify({issue_contract_address: issue_address, 
        verify_contract_address: verify_address, 
        issuer_address:issuer.address,
        holder_addresses:[(ethers.Wallet.createRandom()).address, (ethers.Wallet.createRandom()).address]}), 
        err => {
          // Checking for errors 
          if (err) throw err;
        }
      );
    }
    else{
      fs.writeFile('sample/addresses.json', JSON.stringify({issue_contract_address: issue_address, 
        verify_contract_address: verify_address, 
        issuer_address:issuer.address,
        holder_addresses:[holder1.address, holder2.address]}), 
        err => {
          // Checking for errors 
          if (err) throw err;
        }
      );
    }
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});