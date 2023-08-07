import server from "./server";

function Wallet({ address, setAddress, balance, setBalance, wallets }) {

  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet
        <select
          defaultValue={address}
          onChange={onChange}
        >
          <option value="0">Please select...</option>
          ${wallets.map(w => <option key={w.id} value={w.address}>{w.address}</option>)}
        </select>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
