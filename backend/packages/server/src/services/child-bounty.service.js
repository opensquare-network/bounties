const { HttpError } = require("../utils/exc");
const {
  ChildBounty,
  ChildBountyComment,
  Application,
} = require("../models");
const chainService = require("./chain.service");
const { ChildBountyStatus } = require("../utils/constants");

async function getChildBounties(page, pageSize) {
  const q = { deleted: null };
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
  })
    .populate({
      path: "parentBounty",
      select: "bountyIndex network title logo logoUrl",
    })
    .populate({
      path: "applications",
      select: "bountyIndexer description address createdAt updatedAt",
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
    status: ChildBountyStatus.Open,
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
    "bountyIndexer.network": network,
    "bountyIndexer.parentBountyIndex": parentBountyIndex,
    "bountyIndexer.index": index,
  };

  const total = await ChildBountyComment.count(q);
  const comments = await ChildBountyComment.find(q)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  return {
    items: comments,
    page,
    pageSize,
    total,
  };
}

async function deleteChildBounty(
  network,
  parentBountyIndex,
  index,
  data,
  address,
  signature,
) {
  // Verify caller is the child bounty importer
  const childBounty = await ChildBounty.findOne({
    network,
    parentBountyIndex,
    index,
  });
  if (!childBounty) {
    throw new HttpError(404, "Child bounty not found");
  }

  if (![ChildBountyStatus.Open, ChildBountyStatus.Apply].includes(childBounty.status)) {
    throw new HttpError(403, "Cannot delete the bounty at the moment");
  }

  if (!childBounty.childBounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator can delete it");
  }

  await ChildBountyComment.deleteMany({
    "bountyIndexer.network": network,
    "bountyIndexer.parentBountyIndex": parentBountyIndex,
    "bountyIndexer.index": index,
  });

  await Application.deleteMany({
    "bountyIndexer.network": network,
    "bountyIndexer.parentBountyIndex": parentBountyIndex,
    "bountyIndexer.index": index,
  });

  await ChildBounty.deleteOne({
    network,
    parentBountyIndex,
    index,
  });

  return true;
}

async function updateChildBounty(
  action,
  network,
  parentBountyIndex,
  index,
  data,
  address,
  signature,
) {
  const childBounty = await ChildBounty.findOne({
    network,
    parentBountyIndex,
    index,
  });
  if (!childBounty) {
    throw new HttpError(500, "Child bounty not found");
  }

  let updatedChildBounty;
  if (action === "resolveChildBounty") {
    updatedChildBounty = await resolveChildBounty(childBounty, action, data, address, signature);
  } else {
    throw new HttpError(400, `Unknown action: ${action}`);
  }

  return updatedChildBounty;
}

async function resolveChildBounty(
  childBounty,
  action,
  data,
  address,
  signature,
) {
  if (![ChildBountyStatus.Submitted].includes(childBounty.status)) {
    throw new HttpError(400, "Incorrect child bounty status");
  }

  // Check if caller is bounty curator
  if (!childBounty.childBounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator can resolve");
  }

  const updatedChildBounty = await ChildBounty.findOneAndUpdate(
    { _id: childBounty._id },
    { status: ChildBountyStatus.Awarded },
    { new: true }
  );

  return updatedChildBounty;
}

module.exports = {
  importChildBounty,
  updateChildBounty,
  deleteChildBounty,
  getChildBounties,
  getChildBounty,
  getChildBountyComments,
};
