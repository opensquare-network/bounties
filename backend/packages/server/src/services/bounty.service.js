const { HttpError } = require("../utils/exc");
const { Bounty, BountyComment } = require("../models");
const chainService = require("./chain.service");
const { ipfsAddBuffer } = require("./ipfs.service");

async function getBounties(page, pageSize) {
  const q = {};
  const total = await Bounty.countDocuments(q);
  const items = await Bounty.find(q)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate("childBountiesCount");
  return {
    items,
    total,
    page,
    pageSize,
  };
}

async function getBounty(network, bountyIndex) {
  const bounty = await Bounty.findOne({ network, bountyIndex }).populate({
    path: "childBounties",
    select:
      "network parentBountyIndex index title status childBounty deleted createdAt updatedAt",
  });

  if (!bounty) {
    throw new HttpError(404, "Bounty not found");
  }

  return bounty.toJSON();
}

async function importBounty(
  network,
  bountyIndex,
  logo,
  title,
  content,
  data,
  address,
  signature,
) {
  const exists = await Bounty.exists({ network, bountyIndex });
  if (exists) {
    throw new HttpError(400, "Bounty is already imported");
  }

  const bounty = await chainService.getBounty(network, bountyIndex);
  if (!bounty) {
    throw new HttpError(404, `Can not find bounty ${bountyIndex} on chain`);
  }

  if (bounty.curators.length === 0) {
    throw new HttpError(403, "Can not find bounty curator");
  }

  if (!bounty.curators.includes(address)) {
    throw new HttpError(403, "Only curator is allowed to import the bounty");
  }

  // todo: extract following logic in one separate file and function
  let logoCid;
  if (logo) {
    const fileData = logo.buffer;
    const Megabyte = 1024 * 1024;
    if (logo.size > 10 * Megabyte) {
      throw new HttpError(
        400,
        "The upload file has exceeded the size limitation",
      );
    }

    const result = await ipfsAddBuffer(fileData);
    logoCid = result.path;
  }

  return await Bounty.create({
    network,
    bountyIndex,
    logo: logoCid,
    title,
    content,
    bounty,
    data,
    address,
    signature,
    status: "open",
  });
}

async function getBountyComments(network, bountyIndex, page, pageSize) {
  const q = {
    "bountyIndexer.network": network,
    "bountyIndexer.bountyIndex": bountyIndex,
  };

  const total = await BountyComment.count(q);
  const comments = await BountyComment.find(q)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  return {
    items: comments,
    page,
    pageSize,
    total,
  };
}

module.exports = {
  importBounty,
  getBounties,
  getBounty,
  getBountyComments,
};
