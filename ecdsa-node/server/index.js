import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";

import express from 'express';
import cors from 'cors';

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

// initialized dynamically on frontend startup
const balances = {};

app.post("/initWallets", (req, res) => {
    const { addresses } = req.body;
    addresses?.forEach((address, i) => balances[address] = (i + 1) * 25);
    res.status(200).send({ message: "Wallets initialized!" });
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature: {r, s, recovery}} = req.body;

  const signature = new secp256k1.Signature(BigInt(r), BigInt(s), Number(recovery));
  const messageHash = toHex(keccak256(utf8ToBytes(JSON.stringify(message))));

  const publicKey = signature.recoverPublicKey(messageHash); 
  const isSigned = secp256k1.verify(signature, messageHash, publicKey.toHex());
  if(!isSigned){
    res.status(401).send({ message: "Invalid message signature" });
    return; 
  }
 
  const { sender, recipient, amount } = message;
  const address = toHex(keccak256(publicKey.toRawBytes().slice(1)).slice(-20));
  if(sender !== address){
    res.status(401).send({ message: "Message sender is not confirmed" });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);
 
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
