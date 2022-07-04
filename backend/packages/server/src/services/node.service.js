const Api = require("../utils/api");
const { HttpError } = require("../utils/exc");
const { NODE_API_ENDPOINT } = require("../env");

const cachedApis = {};

function getApi(chain) {
  if (!cachedApis[chain]) {
    cachedApis[chain] = new Api(`${NODE_API_ENDPOINT}/${chain}/`);
  }

  return cachedApis[chain];
}

async function getBountyInfo(api, bountyIndex) {
  try {
    const result = await api.get(`bounty/${bountyIndex}`);
    return result;
  } catch (err) {
    console.error(err.message);
    throw new HttpError(500, "Failed to get bounty");
  }
}

module.exports = {
  getApi,
  getBountyInfo,
};
