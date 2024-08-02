require('dotenv').config({ path: './.env' }) 
import IPFSGatewayTools from "@pinata/ipfs-gateway-tools/dist/node";

async function fetchFromIPFS(source_URL){
    const gatewayTools = new IPFSGatewayTools();
    const desiredGatewayPrefix = "https://"+process.env.GATEWAY_URL+".mypinata.cloud";
    const convertedGatewayURL = gatewayTools.convertToDesiredGateway(source_URL, desiredGatewayPrefix);
    var resData;
    try {
      const res = await fetch(
        `${convertedGatewayURL}?pinataGatewayToken=${process.env.GATEWAY_TOKEN}`
      );
      resData = await res.text();
    } catch (error) {
      console.log(error);
    }
    return resData ?? null
}
export {fetchFromIPFS};
