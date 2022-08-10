const { HttpError } = require("../../../utils/exc");
const { Bounty } = require("../../../models");
const chainService = require("../../chain.service");
const { BountyStatus } = require("../../../utils/constants");

async function reopenBounty(bounty, action, data, address, signature) {
  if (![BountyStatus.Closed].includes(bounty.status)) {
    throw new HttpError(400, 'Can reopen bounty on "closed" status only');
  }

  // Check bounty on-chain status
  const onchainBounty = await chainService.getBounty(
    bounty.network,
    bounty.bountyIndex,
  );
  if (!onchainBounty) {
    throw new HttpError(404, `Can not find bounty ${bountyIndex} on chain`);
  }

  if (!onchainBounty.meta?.status?.active) {
    throw new HttpError(400, `Can reopen active bounty only`);
  }

  // Check if caller is bounty curator
  if (!bounty.bounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator can reopen");
  }

  const updatedBounty = await Bounty.findOneAndUpdate(
    { _id: bounty._id },
    { status: BountyStatus.Open },
    { new: true },
  );

  return updatedBounty;
}

module.exports = {
  reopenBounty,
};
