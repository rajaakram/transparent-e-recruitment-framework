var fs = require('fs');
import sample_cred from "../../sample/credential.json";
import { pinJSONToIPFS } from "../generics/upload";

async function main() {
    // add credential to ipfs
    // could modify to iterate through each file in some credentials directory and add to IPFS but this is only for demonstration purposes
    // if so, make the CIDs.json an array of CID ojects and handle it appropriately in create_licence.ts
    const identifier = "sample_credential"
    var res = await pinJSONToIPFS(sample_cred, identifier)
    // create a json file with the CID and the credential name
    if (res != null){
        fs.writeFile('sample/CIDs.json', JSON.stringify({CID:res.data.IpfsHash, 
            id: identifier}), 
            err => {
            // Checking for errors 
            if (err) throw err;
            }
        );
        console.log("uploaded with CID:", res.data.IpfsHash)
    }
    else{
        console.log(`There was an issue with uploading IPFS file ${identifier}`)
    }
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });