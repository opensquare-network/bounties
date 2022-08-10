const Api = require("../utils/api");
const { HttpError } = require("../utils/exc");
const { NODE_API_ENDPOINT } = require("../env");

const cachedApis = {};

async function getBountyInfo(network, bountyIndex) {
  if (!cachedApis[network]) {
    cachedApis[network] = new Api(`${NODE_API_ENDPOINT}/${network}/`);
  }
  const api = cachedApis[network];

  try {
    return await api.get(`bounty/${bountyIndex}`);
  } catch (err) {
    console.error(err.message);
    throw new HttpError(500, "Failed to get on-chain bounty infomation");
  }
}

async function getChildBountyInfo(network, parentBountyIndex, index) {
  if (!cachedApis[network]) {
    cachedApis[network] = new Api(`${NODE_API_ENDPOINT}/${network}/`);
  }
  const api = cachedApis[network];

  try {
    return await api.get(`child-bounty/${parentBountyIndex}_${index}`);
  } catch (err) {
    console.error(err.message);
    throw new HttpError(500, "Failed to get on-chain child bounty infomation");
  }
}

module.exports = {
  getBountyInfo,
  getChildBountyInfo,
};
