const BigNumber = require("bignumber.js");
const { hexToString } = require("@polkadot/util");
const { HttpError } = require("../utils/exc");
const { NetworkInfo } = require("../utils/chain");
const { getBountyInfo } = require("./node.service");
const { getMultisigAddresses } = require("./multisig.service");

function getCurator(bountyMeta) {
  return (bountyMeta?.status?.active || bountyMeta?.status?.pendingPayout)
    ?.curator;
}

async function getBounty(network, bountyIndex) {
  const { meta, description } = await getBountyInfo(network, bountyIndex);

  if (!meta) {
    throw new HttpError(404, `Bounty does not exists`);
  }

  let curators = [];

  const curator = getCurator(meta);
  if (curator) {
    const multisigCurators = await getMultisigAddresses(network, curator);

    curators = [curator, ...multisigCurators];
  }

  const networkInfo = NetworkInfo[network];
  if (!networkInfo) {
    throw new HttpError(400, `Unsupport network: ${network}`);
  }

  const value = new BigNumber(meta.value).toFixed();

  return {
    curators,
    value,
    decimals: networkInfo.decimals,
    symbol: networkInfo.symbol,
    description: description ? hexToString(description) : "",
    meta,
  };
}

module.exports = {
  getBounty,
};
