const { hexToString } = require("@polkadot/util");
const { HttpError } = require("../utils/exc");
const { NetworkInfo } = require("../utils/chain");
const { getNodeApi, getBountyInfo } = require("./node.service");
const { getMultisigApi, getMultisigAddresses } = require("./multisig.service");

function getCurator(bountyMeta) {
  return (bountyMeta?.status?.active || bountyMeta?.status?.pendingPayout)
    ?.curator;
}

async function getBounty(network, bountyIndex) {
  const nodeApi = await getNodeApi(network);
  const { meta, description } = await getBountyInfo(nodeApi, bountyIndex);

  let curators = [];

  const curator = getCurator(meta);
  if (curator) {
    const multisigApi = await getMultisigApi(network);
    const multisigCurators = await getMultisigAddresses(multisigApi, curator);

    curators = [curator, ...multisigCurators];
  }

  const networkInfo = NetworkInfo[network];
  if (!networkInfo) {
    throw new HttpError(400, `Unsupport network: ${network}`);
  }

  const value = meta.value;

  return {
    curators,
    value,
    decimals: networkInfo.decimals,
    symbol: networkInfo.symbol,
    description: hexToString(description),
    meta,
  };
}

module.exports = {
  getBounty,
};
