
require('dotenv').config();

const axios = require('axios');

axios.post(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`, {
  jsonrpc: "2.0",
  id: 1,
  method: "eth_getBlockByNumber",
  params: [
    "0xb443", // block 46147
    false  // retrieve the full transaction object in transactions array
  ]
}).then(response =>  console.log(response.data.result));
