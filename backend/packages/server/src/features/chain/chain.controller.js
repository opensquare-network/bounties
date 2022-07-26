const chainService = require("../../services/chain.service");

async function getBounty(ctx) {
  const { network, bountyIndex } = ctx.params;
  ctx.body = await chainService.getBounty(network, bountyIndex);
}

async function getChildBounty(ctx) {
  const { network, parentBountyIndex, index } = ctx.params;
  ctx.body = await chainService.getChildBounty(
    network,
    parentBountyIndex,
    index,
  );
}

module.exports = {
  getBounty,
  getChildBounty,
};
