const { sign, verify } = require('./scripts/signature');
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0xb54be4247c5d4b76dea838b6a6c49529edafd0eb": { 
    publicKey: "02fb5bc89f35cbc32cfbe17539225d44598b8a76d3bd7d0b2e5bc8ccfc4d8d766c",
    balance: 100
  },
  "0xd22e7552801f9731ee82cca801034de280802ec1": { 
    publicKey: "02d5803e573b923ded103eb35a94cfd80e2f99e88c1c234e81516b67ac8a0b3206",
    balance: 75
  },
  "0xafd53e99e8f9fee48aa281c0041d40e69f03e744": { 
    publicKey: "03e048702af26f8a6a0e33b39cb599719a8ec6e51c3eafd8139866396c999b6a93",
    balance: 50
  },
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address]?.balance || 0;
  res.send({ balance });
});

app.post("/sign", async (req, res) => {
  const { privateKey } = req.body;

  const response = await sign(privateKey);

  if(response.success) {
    res.send(response);
  }else {
    res.status(400).send("Not a valid private key");
  }
});

app.post("/verify", (req, res) => {
  const { address } = req.body;
  
  if(balances[address]?.publicKey) {
    res.send({ signed: verify(balances[address].publicKey) });
  }else {
    res.status(400).send("Not a valid sender address");
  }
});


app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender].balance -= amount;
    balances[recipient].balance += amount;
    res.send({ balance: balances[sender].balance });
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
