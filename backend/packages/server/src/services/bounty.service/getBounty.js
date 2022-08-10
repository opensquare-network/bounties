const { HttpError } = require("../../utils/exc");
const { Bounty } = require("../../models");
const { ChildBountyStatus } = require("../../utils/constants");

async function getBounty(network, bountyIndex) {
  const bounty = await Bounty.findOne({ network, bountyIndex }).populate({
    path: "childBounties",
    select:
      "network parentBountyIndex index title status childBounty createdAt updatedAt",
  });

  if (!bounty) {
    throw new HttpError(404, "Bounty not found");
  }

  const bountyData = bounty.toJSON();

  const getSort = (childBounty) => {
    switch (childBounty.status) {
      case ChildBountyStatus.Open: {
        return 1;
      }
      case ChildBountyStatus.Assigned: {
        return 2;
      }
      case ChildBountyStatus.Awarded: {
        return 3;
      }
      case ChildBountyStatus.Closed: {
        return 4;
      }
      default: {
        return 5;
      }
    }
  };
  bountyData.childBounties.sort((a, b) => {
    return getSort(a) - getSort(b);
  });

  return bountyData;
}

module.exports = {
  getBounty,
};
