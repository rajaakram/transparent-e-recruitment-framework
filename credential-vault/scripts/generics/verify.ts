import { Signer } from "ethers";

async function verify_func(verify_contract, holder: Signer, NFT_id: number){
    var err;
    try {
        var accepted = await verify_contract.verify(NFT_id, holder.getAddress())
    }
    catch (error){
        err = error;
    }

    if (accepted == 2){
        console.log("REJECTED, token has been revoked")
    }
    else if (accepted == 3){
        console.log("REJECTED, not the owner of the token")
    }
    else if (accepted == 1){
        console.log("REJECTED, token has been suspended by the issuer")
    }
    else if (accepted == 0){
        console.log("ACCEPTED")
    }
    else if (err.message.includes("ERC721NonexistentToken")){
        console.log("REJECTED, Token does not exist")
    }
    else {
        console.log("REJECTED, there was an unexpected error:")
        console.log(err)
    }
    console.log()
    return accepted
}

export { verify_func }
