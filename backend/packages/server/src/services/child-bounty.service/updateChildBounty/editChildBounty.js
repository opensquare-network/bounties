const { HttpError } = require("../../../utils/exc");
const { ChildBounty, ChildBountyTimeline } = require("../../../models");
const { ChildBountyStatus } = require("../../../utils/constants");

async function editChildBounty(childBounty, action, data, address, signature) {
  if (
    ![ChildBountyStatus.Open, ChildBountyStatus.Assigned].includes(
      childBounty.status,
    )
  ) {
    throw new HttpError(
      400,
      'Can edit child bounty on "open" or "assigned" status only',
    );
  }

  // Check if caller is bounty curator
  if (!childBounty.childBounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator can edit");
  }

  const { title, content } = data || {};
  if (!title) {
    throw new HttpError(400, "Title is missing");
  }

  if (!content) {
    throw new HttpError(400, "Content is missing");
  }

  const updatedChildBounty = await ChildBounty.findOneAndUpdate(
    { _id: childBounty._id },
    { title, content, data },
    { new: true },
  );

  await ChildBountyTimeline.create({
    bountyIndexer: {
      network: childBounty.network,
      parentBountyIndex: childBounty.parentBountyIndex,
      index: childBounty.index,
    },
    action,
    data,
    address,
    signature,
  });

  return updatedChildBounty;
}

module.exports = {
  editChildBounty,
};
