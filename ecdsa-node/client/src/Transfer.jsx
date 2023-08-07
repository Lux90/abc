import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { useState } from "react";
import server from "./server";


function Transfer({ address, setBalance, wallets }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    if(address === 0) return alert("Please select your wallet");
    if(recipient === 0) return alert("Please provide recipient's wallet");

    const pk = wallets.find(w => w.address === address)?.pk;
    if(!pk) return alert("Oops... Something went wrong!");

    const message = { sender: address, recipient, amount: Number(sendAmount) };
    const messageHash = keccak256(utf8ToBytes(JSON.stringify(message)));
    const signature = secp256k1.sign(messageHash, pk);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        message,
        signature,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
