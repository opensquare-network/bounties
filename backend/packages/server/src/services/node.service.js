const Api = require("./nodeApi");
const { HttpError } = require("../utils/exc");
const { NODE_API_ENDPOINT } = require("../env");

const cachedApis = {};

function getApi(chain) {
  if (!cachedApis[chain]) {
    cachedApis[chain] = new Api(`${NODE_API_ENDPOINT}/${chain}/`);
  }

  return cachedApis[chain];
}

async function getRemark(api, blockHash, extrinsicIndex) {
  try {
    const result = await api.get(
      `remark/block/${blockHash}/extrinsic/${extrinsicIndex}`
    );
    return result;
  } catch (err) {
    console.error(err.message);
    throw new HttpError(500, "Failed to get remark");
  }
}

async function getNativeTokenInfo(api) {
  try {
    const result = await api.get("token/native/info");
    return result;
  } catch (err) {
    throw new HttpError(500, "Failed to get native token info");
  }
}

async function getAssetTokenInfo(api, assetId, blockHash) {
  try {
    const url = blockHash
      ? `token/${assetId}/${blockHash}/info`
      : `token/${assetId}/info`;
    const result = await api.get(url);
    return result;
  } catch (err) {
    throw new HttpError(500, "Failed to get asset token info");
  }
}

async function submitRemarks(api, remarks) {
  try {
    const result = await api.post("remark/batchsend", { remarks });
    return result;
  } catch (err) {
    throw new HttpError(500, "Failed to submit remarks");
  }
}

module.exports = {
  getApi,
  getRemark,
  getNativeTokenInfo,
  getAssetTokenInfo,
  submitRemarks,
};
