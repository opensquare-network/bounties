const { ChildBounty } = require("../../models");
const { ChildBountyStatus } = require("../../utils/constants");

async function getChildBounties(page, pageSize) {
  const q = {
    status: {
      $nin: [ChildBountyStatus.Closed, ChildBountyStatus.Awarded],
    },
  };
  const total = await ChildBounty.countDocuments(q);
  const items = await ChildBounty.find(q)
    .populate("parentBounty")
    .skip((page - 1) * pageSize)
    .limit(pageSize);
  return {
    items,
    total,
    page,
    pageSize,
  };
}

module.exports = {
  getChildBounties,
};
