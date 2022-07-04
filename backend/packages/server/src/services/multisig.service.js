const Api = require("../utils/api");
const { HttpError } = require("../utils/exc");
const { MULTISIG_API_ENDPOINT } = require("../env");

const cachedApis = {};

function getApi(chain) {
  if (!cachedApis[chain]) {
    cachedApis[chain] = new Api(`${MULTISIG_API_ENDPOINT}/${chain}/`);
  }

  return cachedApis[chain];
}

async function getMultisigAddresses(api, address) {
  try {
    const result = []; //TODO: await api.get(`multisig/address/${address}`);
    return result;
  } catch (err) {
    console.error(err.message);
    throw new HttpError(500, "Failed to get multisig address");
  }
}

module.exports = {
  getApi,
  getMultisigAddresses,
};
