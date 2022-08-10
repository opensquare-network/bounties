const bountyService = require("../../services/bounty.service");
const { HttpError } = require("../../utils/exc");
const { extractPage } = require("../../utils/pagination");
const isNil = require("lodash.isnil");
const trim = require("lodash.trim");
const { allChains } = require("../../utils/chain");
const { BountyActions } = require("../../utils/constants");

async function getBounties(ctx) {
  const { page, pageSize } = extractPage(ctx);

  ctx.body = await bountyService.getBounties(page, pageSize);
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

  if (action !== BountyActions.ImportBounty) {
    throw new HttpError(400, { action: ["Action must be importBounty"] });
  }

  if (!network || !allChains.includes(network)) {
    throw new HttpError(400, { network: ["Invalid network"] });
  }

  if (isNil(bountyIndex)) {
    throw new HttpError(400, { bountyIndex: ["Bounty index is missing"] });
  }

  const trimmedTitle = trim(title);
  if (!trimmedTitle) {
    throw new HttpError(400, { title: ["Title is missing"] });
  }

  const trimmedContent = trim(content);
  if (!trimmedContent) {
    throw new HttpError(400, { content: ["Content is missing"] });
  }

  ctx.body = await bountyService.importBounty(
    network,
    parseInt(bountyIndex),
    logo,
    trimmedTitle,
    trimmedContent,
    data,
    address,
    signature,
  );
}

async function updateBounty(ctx) {
  const { data, address, signature } = ctx.request.body;

  const { action, network, bountyIndex } = data || {};

  if (!action) {
    throw new HttpError(400, "Action is missing");
  }

  if (!network) {
    throw new HttpError(400, "Network is missing");
  }

  if (bountyIndex === undefined) {
    throw new HttpError(400, "Bounty index is missing");
  }

  ctx.body = await bountyService.updateBounty(
    action,
    network,
    parseInt(bountyIndex),
    data,
    address,
    signature,
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

async function getBountyComments(ctx) {
  const { network, bountyIndex } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  if (!network) {
    throw new HttpError(400, "Network is missing");
  }

  if (bountyIndex === undefined) {
    throw new HttpError(400, "Bounty index is missing");
  }

  ctx.body = await bountyService.getBountyComments(
    network,
    parseInt(bountyIndex),
    page,
    pageSize,
  );
}

module.exports = {
  getBounty,
  getBounties,
  importBounty,
  updateBounty,
  getBountyComments,
};
