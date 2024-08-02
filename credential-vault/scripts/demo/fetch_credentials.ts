import { ethers } from "hardhat";
import issue_abi from "../../abi/contracts/Issuance.sol/Issuance.json"
import { fetchFromIPFS } from "../generics/fetch";
import addresses from "../../sample/addresses.json"
import NFTs from "../../sample/NFTs.json"

async function main() {
    // get credential from ipfs
    const issue_address = addresses["issue_contract_address"]
    const holder = await ethers.getSigner(addresses["holder_addresses"][0])
    const issue = new ethers.Contract(issue_address, issue_abi, holder)
    var encrypted_cred;
    try{
        const CID = await issue.tokenURI(NFTs.id)
        encrypted_cred = JSON.parse(await fetchFromIPFS(CID))
        console.log("Found encrypted credential:\n",encrypted_cred,"\nusing NFT id:",NFTs.id,"which resolved to CID:",CID)
    }
    catch(error){
        console.log("Something went wrong,",error)
    }
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });