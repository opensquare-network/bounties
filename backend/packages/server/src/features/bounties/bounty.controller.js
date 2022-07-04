const bountyService = require("../../services/bounty.service");
const { HttpError } = require("../../utils/exc");
const { extractPage } = require("../../utils/pagination");

async function getBounties(ctx) {
  const { page, pageSize } = extractPage(ctx);

  const result = await bountyService.getBounties(page, pageSize);

  ctx.body = result;
}

async function importBounty(ctx) {
  const {
    data: { network, bountyIndex, logo } = {},
    address,
    signature,
  } = ctx.request.body;

  if (!network) {
    throw new HttpError(400, "Network is missing")
  }

  if (bountyIndex === undefined) {
    throw new HttpError(400, "Bounty index is missing")
  }

  ctx.body = await bountyService.importBounty(network, parseInt(bountyIndex), logo, data, address, signature);
}

async function getBounty(ctx) {
  const { network, bountyIndex } = ctx.params;
  //TODO: check param

  ctx.body = await bountyService.getBounty(network, parseInt(bountyIndex));
}

module.exports = {
  getBounty,
  getBounties,
  importBounty,
};
