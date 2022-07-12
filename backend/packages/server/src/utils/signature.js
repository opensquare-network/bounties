const { encodeAddress, signatureVerify } = require("@polkadot/util-crypto");

function isValidSignature(signedMessage, signature, address) {
  try {
    const result = signatureVerify(signedMessage, signature, address);
    return encodeAddress(result.publicKey, 42) === encodeAddress(address, 42);
  } catch (e) {
    return false;
  }
}

module.exports = {
  isValidSignature,
};
