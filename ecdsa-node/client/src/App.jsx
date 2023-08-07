import Wallet from "./Wallet";
import Transfer from "./Transfer";
import { useEffect, useState } from "react";
import { generateWallets } from "./wallets";
import server from "./server";
import "./App.scss";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState(0);
  const [wallets] = useState(() => generateWallets(3));

  useEffect(() => {
    server.post(`initWallets`, { addresses: wallets.map(w => w.address) });
  }, [wallets]);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        wallets={wallets}
      />
      <Transfer setBalance={setBalance} address={address}  wallets={wallets} />
    </div>
  );
}

export default App;
