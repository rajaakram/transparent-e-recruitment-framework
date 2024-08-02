import { ethers } from "hardhat";
import abi from "../../abi/contracts/Issuance.sol/Issuance.json"
import verify_abi from "../../abi/contracts/Verification.sol/Verification.json"
import issue_BC from "../../artifacts/contracts/Issuance.sol/Issuance.json"
import addresses from "../../sample/addresses.json"
var fs = require('fs');

const test_number: number = 50;

function random_string(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}


async function main() {
    const [issuer] = await ethers.getSigners()
    const holder = await ethers.getSigner(addresses["holder_addresses"][0])
    let Issue = new ethers.ContractFactory(abi, issue_BC.bytecode, issuer)

    // deployment
    for (let j = 0; j < 10; j++){
        var stream = fs.createWriteStream(`sample/metrics/data_${j}.csv`, {flags:'a'})
        stream.write("gas,method,sub_method\n")
        console.log("test",j)
        for (let i = 0; i < 1; i++){
            let issue = await Issue.deploy();
            stream.write((await issue.deploymentTransaction().wait()).gasUsed + ',deployment,\n')
            for (let i = 0; i < test_number; i++){
                // a random CID between length 32 and 64 characters
                const random_CID = random_string(Math.floor(Math.random() * 65) + 32)
                // NFT creation
                let tx = await issue.create(holder.address, "ipfs://"+random_CID)
                let res = await tx.wait()
                stream.write(res.gasUsed+",creation,\n")
                let id = res.logs[0].args[2]
                // suspension
                tx = await issue.suspend(id, random_string(Math.floor(Math.random() * 64)))
                stream.write((await tx.wait()).gasUsed+",suspension,\n")
                // unsuspension
                tx = await issue.reinstate(id, random_string(Math.floor(Math.random() * 64)))
                stream.write((await tx.wait()).gasUsed+",reinstation,\n")
                // revocation
                tx = await issue.revoke(id, random_string(Math.floor(Math.random() * 64)))
                stream.write((await tx.wait()).gasUsed+",revocation,\n")
            }
        }
        // verification
        const issue = await Issue.deploy();
        await issue.waitForDeployment();
        const verify = new ethers.Contract(await issue.verify_contract(), verify_abi, issuer)
        // CASE: different owner
        for (let i = 0; i < test_number; i++){
            try {
                let temp_tx = await issue.create(issuer.address, "")
                let id = (await temp_tx.wait()).logs[0].args[2]
                // have to do a workaround because ethers returns value instead of TransactionResponse for functions with return value
                await verify.verify(id, holder.getAddress())
                let receipt = await ethers.provider.getTransactionReceipt((await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).transactions[0])
                stream.write(receipt.gasUsed+",verification,diff_owner\n")
            }
            catch (error){console.log(error, "in ver diff_owner")}
        }
        // CASE: revoked
        for (let i = 0; i < test_number; i++){
            try {
                let temp_tx = await issue.create(holder.address, "")
                let id = (await temp_tx.wait()).logs[0].args[2]
                await issue.revoke(id, "")
                // have to do a workaround because ethers returns value instead of TransactionResponse for functions with return value
                await verify.verify(id, holder.getAddress())
                let receipt = await ethers.provider.getTransactionReceipt((await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).transactions[0])
                stream.write(receipt.gasUsed+",verification,revoked\n")
            }
            catch (error){console.log(error, "in ver revoked")}
        }
        // CASE: suspended
        for (let i = 0; i < test_number; i++){
            try{
                let temp_tx = await issue.create(holder.address, "")
                let id = (await temp_tx.wait()).logs[0].args[2]
                await issue.suspend(id, "")
                // have to do a workaround because ethers returns value instead of TransactionResponse for functions with return value
                await verify.verify(id, holder.getAddress())
                let receipt = await ethers.provider.getTransactionReceipt((await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).transactions[0])
                stream.write(receipt.gasUsed+",verification,suspended\n")
            }
            catch (error){console.log(error, "in ver suspended")}
        }
        // CASE: valid
        for (let i = 0; i < test_number; i++){
            try{
                let temp_tx = await issue.create(holder.address, "")
                let id = (await temp_tx.wait()).logs[0].args[2]
                // have to do a workaround because ethers returns value instead of TransactionResponse for functions with return value
                await verify.verify(id, holder.getAddress())
                let receipt = await ethers.provider.getTransactionReceipt((await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).transactions[0])
                stream.write(receipt.gasUsed+",verification,valid\n")
            }
            catch (error){console.log(error, "in ver valid")}
        }
        stream.end()
        console.log(`Raw gas usage saved in sample/metrics/data_${j}.csv file`)
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });