const { Bounty } = require("../../models");
const { BountyStatus } = require("../../utils/constants");

async function getBounties(page, pageSize) {
  const q = {
    status: {
      $ne: BountyStatus.Closed,
    },
  };
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

module.exports = {
  getBounties,
};
