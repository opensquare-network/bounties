const { HttpError } = require("../../utils/exc");
const { ChildBounty, Bounty } = require("../../models");
const chainService = require("../chain.service");
const { ChildBountyStatus, BountyStatus } = require("../../utils/constants");

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
  const parentBounty = await Bounty.findOne({
    network,
    bountyIndex: parentBountyIndex,
  });
  if (!parentBounty) {
    throw new HttpError(400, "Parent bounty has not been imported yet");
  }

  if (parentBounty.status === BountyStatus.Closed) {
    throw new HttpError(400, "Parent bounty has been closed");
  }

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

  if (!childBounty.meta?.status?.active) {
    throw new HttpError(400, `Can import active child bounty only`);
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

module.exports = {
  importChildBounty,
};
