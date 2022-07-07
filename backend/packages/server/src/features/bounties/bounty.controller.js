const bountyService = require("../../services/bounty.service");
const { HttpError } = require("../../utils/exc");
const { extractPage } = require("../../utils/pagination");
const isNil = require("lodash.isnil");
const trim = require("lodash.trim");
const { allChains } = require("../../utils/chain");

async function getBounties(ctx) {
  const { page, pageSize } = extractPage(ctx);

  const result = await bountyService.getBounties(page, pageSize);

  ctx.body = result;
}

async function importBounty(ctx) {
  const { data: msg, address, signature } = ctx.request.body;

  let data;
  try {
    data = JSON.parse(msg);
  } catch (e) {
    throw new HttpError(400, "Invalid data");
  }

  const { action, network, bountyIndex, title, content } = data || {};
  const logo = ctx.request.file;

  if (action !== "importBounty") {
    throw new HttpError(400, { action: ["Action must be importBounty"] });
  }

  if (!network || !allChains.includes(network)) {
    throw new HttpError(400, { network: ["Invalid network"] });
  }

  if (isNil(bountyIndex)) {
    throw new HttpError(400, { bountyIndex: ["Bounty index is missing"] });
  }

  const trimTitle = trim(title);
  if (!trimTitle) {
    throw new HttpError(400, { title: ["Title is missing"] });
  }

  const trimContent = trim(content);
  if (!trimContent) {
    throw new HttpError(400, { content: ["Content is missing"] });
  }

  ctx.body = await bountyService.importBounty(
    network,
    parseInt(bountyIndex),
    logo,
    trimTitle,
    trimContent,
    data,
    address,
    signature
  );
}

async function getBounty(ctx) {
  const { network, bountyIndex } = ctx.params;

  if (!network) {
    throw new HttpError(400, "Network is missing");
  }

  if (bountyIndex === undefined) {
    throw new HttpError(400, "Bounty index is missing");
  }

  ctx.body = await bountyService.getBounty(network, parseInt(bountyIndex));
}

module.exports = {
  getBounty,
  getBounties,
  importBounty,
};
