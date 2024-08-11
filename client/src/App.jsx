import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState, useEffect } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [isSigned, setIsSigned] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(()=> {
    if(isSigned) setTimeout(()=>setIsSigned(false), 600);
  }, [isSigned])

  useEffect(()=>setIsVerified(false),[address]);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        isSigned={isSigned}
        setIsSigned={setIsSigned}
      />
      <Transfer setBalance={setBalance} address={address} isVerified={isVerified} setIsVerified={setIsVerified} />
    </div>
  );
}

export default App;
