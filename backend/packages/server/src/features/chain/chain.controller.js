const chainService = require("../../services/chain.service");

async function getBounty(ctx) {
  const { network, bountyIndex } = ctx.params;
  ctx.body = await chainService.getBounty(network, bountyIndex);
}

module.exports = {
  getBounty,
};
