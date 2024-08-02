import { ethers } from "hardhat";
import verify_abi from "../../abi/contracts/Verification.sol/Verification.json"
import issue_abi from "../../abi/contracts/Issuance.sol/Issuance.json"
import addresses from "../../sample/addresses.json"
import NFTs from "../../sample/NFTs.json"
import { verify_func } from "../generics/verify";

async function main() {
    const issue_address = addresses["issue_contract_address"]
    const verify_address = addresses["verify_contract_address"]
    const issuer = await ethers.getSigner(addresses["issuer_address"])
    const verifier = await ethers.getSigner(addresses["holder_addresses"][1])
    var holder = await ethers.getSigner(addresses["holder_addresses"][0])
    const verify = new ethers.Contract(verify_address, verify_abi, verifier)
    const NFT_id = NFTs.id

    console.log("verifier:",verifier.address,"verifies holder:",holder.address,"\nusing contract:", verify_address,"for NFT with ID:",NFT_id,"\n")
    // should log "ACCEPTED"
    await verify_func(verify, holder, NFT_id)
    // should log "REJECTED, not the owner of the token"
    let _temp = holder
    holder = verifier
    console.log("Changing holder address...")
    console.log("verifier:",verifier.address,"verifies holder:",holder.address,"\nusing contract:", verify_address,"for NFT with ID:",NFT_id,"\n")
    await verify_func(verify, holder, NFT_id)
    // should log "REJECTED, token has been suspended by the issuer"
    holder = _temp
    const issue = new ethers.Contract(issue_address, issue_abi, issuer);
    await (await issue.suspend(NFT_id, "Speeding 2 week suspension")).wait()
    console.log("Changing back the holder address...")
    console.log("Suspending credential with id:",NFT_id)
    console.log("verifier:",verifier.address,"verifies holder:",holder.address,"\nusing contract:", verify_address,"for NFT with ID:",NFT_id,"\n")
    await verify_func(verify, holder, NFT_id);
    await (await issue.reinstate(NFT_id, "Speeding suspension over")).wait()
    console.log("reinstating credential...")
    // should log "REJECTED, token does not exist or has been revoked"
    console.log("verifier:",verifier.address,"verifies holder:",holder.address,"\nusing contract:", verify_address,"for NFT with ID:", 10000,"\n")
    await verify_func(verify, holder, 10000); // a bogus NFT id
    await (await issue.revoke(NFT_id, "Fraudulent application")).wait()
    console.log("Revoking credential...")
    console.log("verifier:",verifier.address,"verifies holder:",holder.address,"\nusing contract:", verify_address,"for NFT with ID:",NFT_id,"\n")
    await verify_func(verify, holder, NFT_id)
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });