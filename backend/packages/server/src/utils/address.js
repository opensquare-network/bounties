const { encodeAddress, decodeAddress } = require("@polkadot/util-crypto");

function isSamePublicKey(key1, key2) {
  return encodeAddress(key1, 42) === encodeAddress(key2, 42);
}

function toPublicKey(address) {
  const publicKey = decodeAddress(address);
  return Buffer.from(publicKey).toString("hex");
}

module.exports = {
  isSamePublicKey,
  toPublicKey,
};
