const { HttpError } = require("../utils/exc");
const { ChildBounty, Comment } = require("../models");
const chainService = require("./chain.service");

async function getChildBounties(page, pageSize) {
  const q = {};
  const total = await ChildBounty.countDocuments(q);
  const items = await ChildBounty.find(q)
    .skip((page - 1) * pageSize)
    .limit(pageSize);
  return {
    items,
    total,
    page,
    pageSize,
  };
}

async function getChildBounty(network, parentBountyIndex, index) {
  const childBounty = await ChildBounty.findOne({
    network,
    parentBountyIndex,
    index,
  }).populate({
    path: "parentBounty",
    select: "bountyIndex network title logo logoUrl",
  }).populate({
    path: "applications",
    select: "bountyIndexer description address createdAt updatedAt"
  });

  if (!childBounty) {
    throw new HttpError(404, "Child bounty not found");
  }

  return childBounty.toJSON();
}

async function importChildBounty(
  network,
  parentBountyIndex,
  index,
  title,
  content,
  skills,
  data,
  address,
  signature,
) {
  const exists = await ChildBounty.exists({
    network,
    parentBountyIndex,
    index,
  });
  if (exists) {
    throw new HttpError(400, "Child bounty is already imported");
  }

  const childBounty = await chainService.getChildBounty(
    network,
    parentBountyIndex,
    index,
  );
  if (!childBounty) {
    throw new HttpError(404, `Can not find child bounty ${index} on chain`);
  }

  if (childBounty.curators.length === 0) {
    throw new HttpError(403, "Can not find child bounty curator");
  }

  if (!childBounty.curators.includes(address)) {
    throw new HttpError(
      403,
      "Only curator is allowed to import the child bounty",
    );
  }

  return await ChildBounty.create({
    network,
    parentBountyIndex,
    index,
    title,
    content,
    skills,
    childBounty,
    data,
    address,
    signature,
  });
}

async function getChildBountyComments(
  network,
  parentBountyIndex,
  index,
  page,
  pageSize,
) {
  const q = {
    "bountyIndexer.type": "childBounty",
    "bountyIndexer.network": network,
    "bountyIndexer.bountyIndex": parentBountyIndex,
    "bountyIndexer.childBountyIndex": index,
  };

  const total = await Comment.count(q);
  const comments = await Comment.find(q)
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
  importChildBounty,
  getChildBounties,
  getChildBounty,
  getChildBountyComments,
};
