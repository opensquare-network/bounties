const { encodeAddress, signatureVerify } = require("@polkadot/util-crypto");

function isValidSignature(signedMessage, signature, address) {
  const result = signatureVerify(signedMessage, signature, address);
  try {
    return encodeAddress(result.publicKey, 42) === encodeAddress(address, 42);
  } catch (e) {
    return false;
  }
}

module.exports = {
  isValidSignature,
};
