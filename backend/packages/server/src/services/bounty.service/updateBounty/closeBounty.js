const { HttpError } = require("../../../utils/exc");
const { Bounty } = require("../../../models");
const { BountyStatus } = require("../../../utils/constants");

async function closeBounty(bounty, action, data, address, signature) {
  if (![BountyStatus.Open].includes(bounty.status)) {
    throw new HttpError(400, 'Can close bounty on "open" status only');
  }

  // Check if caller is bounty curator
  if (!bounty.bounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator can close");
  }

  const updatedBounty = await Bounty.findOneAndUpdate(
    { _id: bounty._id },
    { status: BountyStatus.Closed },
    { new: true },
  );

  return updatedBounty;
}

module.exports = {
  closeBounty,
};
