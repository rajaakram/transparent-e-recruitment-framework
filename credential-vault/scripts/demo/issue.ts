import { ethers } from "hardhat";
var fs = require('fs');
import addresses from "../../sample/addresses.json"
import CID from "../../sample/CIDs.json"
import { issue } from "../generics/issue"

async function main() {
    // read addresses from files
    const issue_address = addresses["issue_contract_address"]
    const issuer = await ethers.getSigner(addresses["issuer_address"])
    const holder = await ethers.getSigner(addresses["holder_addresses"][0])
    const { tx, id } = await issue(issue_address, issuer, holder, "ipfs://"+CID['CID'])

    var stream = fs.createWriteStream("sample/NFTs.json", {flags:'w'});
    stream.write(JSON.stringify({id:Number(id), 
        holder:holder.address}) + "\n");
    console.log(`NFT create with id: ${id}, to holder with address: ${holder.address}`)
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });