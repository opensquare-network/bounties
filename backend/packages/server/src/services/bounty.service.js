const { HttpError } = require("../utils/exc");
const { Bounty, Comment } = require("../models");
const chainService = require("./chain.service");

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
  const bounty = await chainService.getBounty(network, bountyIndex);
  if (!bounty) {
    throw new HttpError(404, "Bounty is not found");
  }

  if (bounty.curators.length === 0) {
    throw new HttpError(403, "Bounty curator is not assigned yet");
  }

  if (!bounty.curators.includes(address)) {
    throw new HttpError(403, "Only curator is allowed to import the bounty");
  }

  const result = await Bounty.create({
    network,
    bountyIndex,
    logo,
    title,
    content,
    bounty,
    data,
    address,
    signature,
  });

  return result;
}

module.exports = {
  importBounty,
  getBounties,
  getBounty,
};
