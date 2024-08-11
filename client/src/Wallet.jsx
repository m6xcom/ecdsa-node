import server from "./server";
import { useState } from "react";

function Wallet({ address, setAddress, balance, setBalance, isSigned, setIsSigned }) {
  const [privateKey, setPrivateKey] = useState('');

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

  async function sign(e) {
    e.preventDefault();
    try {
      const response = await server.post('/sign', { privateKey });
      if(response?.data?.success) {
        setIsSigned(true);
      }
    } catch (error) {
      alert(error.response.data);
    }finally {
      setPrivateKey("");
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Address
        <input placeholder="Type address" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
      <form onSubmit={sign}>
        <h2>Sign message</h2>
        <label>
          Private key
          <input placeholder="Type address private key" value={privateKey} onChange={(e)=>setPrivateKey(e.target.value)}></input>
        </label>
        <input type="submit" className="button" value="Sign" />
        { isSigned && (
            <span style={{color: "green", display: "block", marginTop: "10px"}}>Success &#10004;</span>
        ) }
      </form>
    </div>
  );
}

export default Wallet;
