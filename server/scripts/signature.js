const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");

let signature, hashedMessage = keccak256(utf8ToBytes('Login!'));

const fromHexString = (hexString) =>
    Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

async function sign(privateKey) {
    try {
        signature = await secp256k1.sign(hashedMessage, fromHexString(privateKey));
        return {success: true}
    }catch(error) {
        return error;
    }
}

function verify(publicKey) {
    if(!signature) return false;
    return secp256k1.verify(signature, hashedMessage, publicKey);
}


module.exports = { sign, verify }