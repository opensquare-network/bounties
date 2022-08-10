const chainService = require("../../services/chain.service");
const { HttpError } = require("../../utils/exc");

async function getBounty(ctx) {
  const { network, bountyIndex } = ctx.params;
  const bounty = await chainService.getBounty(network, bountyIndex);

  if (!bounty) {
    throw new HttpError(404, "Bounty is not found on chain");
  }

  ctx.body = bounty;
}

async function getChildBounty(ctx) {
  const { network, parentBountyIndex, index } = ctx.params;
  const childBounty = await chainService.getChildBounty(
    network,
    parentBountyIndex,
    index,
  );

  if (!childBounty) {
    throw new HttpError(404, "Child bounty is not found on chain");
  }

  ctx.body = childBounty;
}

module.exports = {
  getBounty,
  getChildBounty,
};
