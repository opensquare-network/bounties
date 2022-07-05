const bountyService = require("../../services/bounty.service");
const { HttpError } = require("../../utils/exc");
const { extractPage } = require("../../utils/pagination");

async function getBounties(ctx) {
  const { page, pageSize } = extractPage(ctx);

  const result = await bountyService.getBounties(page, pageSize);

  ctx.body = result;
}

async function importBounty(ctx) {
  const { data, address, signature } = ctx.request.body;
  const { action, network, bountyIndex, title, content } = JSON.parse(data) || {};
  const logo = ctx.request.file;

  if (action !== "importBounty") {
    throw new HttpError(400, { action: ["Action must be importBounty"] });
  }

  if (!network) {
    throw new HttpError(400, { network: ["Network is missing"] });
  }

  if (bountyIndex === undefined) {
    throw new HttpError(400, { bountyIndex: ["Bounty index is missing"] });
  }

  if (!title) {
    throw new HttpError(400, { title: ["Title is missing"] });
  }

  if (!content) {
    throw new HttpError(400, { content: ["Content is missing"] });
  }

  ctx.body = await bountyService.importBounty(
    network,
    parseInt(bountyIndex),
    logo,
    title,
    content,
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
