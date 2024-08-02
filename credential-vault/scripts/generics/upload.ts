const axios = require('axios')
const fs = require('fs')
require('dotenv').config({ path: './SECRETS.env' }) 

async function pinJSONToIPFS(credential_json, name) {
    const data = JSON.stringify({
        pinataContent: credential_json,
        pinataMetadata: {
            name: name
        },
        pinataOptions:{
            cidVersion: 1
        }
    })

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${process.env.PINATA_API_KEY}`
        }
      });
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
}
export {pinJSONToIPFS};
