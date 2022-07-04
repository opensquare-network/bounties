const { hexToString } = require("@polkadot/util");
const { HttpError } = require("../utils/exc");
const { Bounty, Comment } = require("../models");
const { NetworkInfo } = require("../utils/chain");
const { getNodeApi, getBountyInfo } = require("./node.service");
const { getMultisigApi, getMultisigAddresses } = require("./multisig.service");

async function getBounties(page, pageSize) {
  const q = {};
  const total = await Bounty.countDocuments(q);
  const items = await Bounty.find(q)
    .skip((page - 1) * pageSize)
    .limit(pageSize);
  return {
    items,
    total,
    page,
    pageSize,
  };
}

async function getBounty(network, bountyIndex) {
  const bounty = await Bounty.findOne({ network, bountyIndex });
  const comments = await Comment.find({
    "indexer.type": "bounty",
    "indexer.network": network,
    "indexer.bountyIndex": bountyIndex,
  });

  return {
    ...bounty,
    comments,
  };
}

function getCurator(bountyMeta) {
  return (bountyMeta?.status?.active || bountyMeta?.status?.pendingPayout)
    ?.curator;
}

async function importBounty(
  network,
  bountyIndex,
  logo,
  title,
  content,
  data,
  address,
  signature
) {
  const nodeApi = await getNodeApi(network);
  const { meta, description } = await getBountyInfo(nodeApi, bountyIndex);

  const curator = getCurator(meta);
  if (!curator) {
    throw new HttpError(403, "Bounty curator is not found");
  }

  const multisigApi = await getMultisigApi(network);
  const multisigCurators = await getMultisigAddresses(multisigApi, curator);

  if (
    curator !== address &&
    (!multisigCurators || !multisigCurators.include(address))
  ) {
    throw new HttpError(403, "Only curator is allowd to import the bounty");
  }

  const networkInfo = NetworkInfo[network];
  if (!networkInfo) {
    throw new HttpError(400, `Unsupport network: ${network}`);
  }

  const value = meta.value;

  const bounty = await Bounty.create({
    network,
    bountyIndex,
    logo,
    title,
    content,
    bounty: {
      curators: [curator, ...multisigCurators],
      value,
      decimals: networkInfo.decimals,
      symbol: networkInfo.symbol,
      description: hexToString(description),
      meta,
    },
  });

  return bounty;
}

module.exports = {
  importBounty,
  getBounties,
  getBounty,
};
