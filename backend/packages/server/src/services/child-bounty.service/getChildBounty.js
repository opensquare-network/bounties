const { HttpError } = require("../../utils/exc");
const { ChildBounty } = require("../../models");

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
      select: "bountyIndexer description address status createdAt updatedAt",
    });

  if (!childBounty) {
    throw new HttpError(404, "Child bounty not found");
  }

  return childBounty.toJSON();
}

module.exports = {
  getChildBounty,
};
