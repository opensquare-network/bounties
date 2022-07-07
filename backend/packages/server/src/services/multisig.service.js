const Api = require("../utils/api");
const { HttpError } = require("../utils/exc");
const { MULTISIG_API_ENDPOINT } = require("../env");

const cachedApis = {};

async function getMultisigAddresses(network, address) {
  if (!cachedApis[network]) {
    cachedApis[network] = new Api(`${ MULTISIG_API_ENDPOINT }/${ network }/`);
  }

  const api = cachedApis[network];

  try {
    const result = await api.get(`multisig/address/${ address }`);
    return result?.signatories || [];
  } catch (err) {
    console.error(err.message);
    throw new HttpError(500, "Failed to get multisig address");
  }
}

module.exports = {
  getMultisigAddresses,
};
