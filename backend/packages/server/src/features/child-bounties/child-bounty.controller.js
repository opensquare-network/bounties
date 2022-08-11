const childBountyService = require("../../services/child-bounty.service");
const { HttpError } = require("../../utils/exc");
const { extractPage } = require("../../utils/pagination");
const isNil = require("lodash.isnil");
const trim = require("lodash.trim");
const { allChains } = require("../../utils/chain");
const { ChildBountyActions } = require("../../utils/constants");

async function getChildBounties(ctx) {
  const { page, pageSize } = extractPage(ctx);

  ctx.body = await childBountyService.getChildBounties(page, pageSize);
}

async function importChildBounty(ctx) {
  const { data, address, signature } = ctx.request.body;

  const { action, network, parentBountyIndex, index, title, content, skills } =
    data || {};

  if (action !== ChildBountyActions.ImportChildBounty) {
    throw new HttpError(400, { action: ["Action must be importChildBounty"] });
  }

  if (!network || !allChains.includes(network)) {
    throw new HttpError(400, { network: ["Invalid network"] });
  }

  if (isNil(parentBountyIndex)) {
    throw new HttpError(400, {
      parentBountyIndex: ["Parent bounty index is missing"],
    });
  }

  if (isNil(index)) {
    throw new HttpError(400, { index: ["Child bounty index is missing"] });
  }

  if (
    skills &&
    (!Array.isArray(skills) || skills.some((item) => typeof item !== "string"))
  ) {
    throw new HttpError(400, { skills: ["Skills must be array of string"] });
  }

  const trimmedTitle = trim(title);
  if (!trimmedTitle) {
    throw new HttpError(400, { title: ["Title is missing"] });
  }

  const trimmedContent = trim(content);
  if (!trimmedContent) {
    throw new HttpError(400, { content: ["Content is missing"] });
  }

  ctx.body = await childBountyService.importChildBounty(
    network,
    parseInt(parentBountyIndex),
    index,
    trimmedTitle,
    trimmedContent,
    skills,
    data,
    address,
    signature,
  );
}

async function updateChildBounty(ctx) {
  const { data, address, signature } = ctx.request.body;

  const { action, network, parentBountyIndex, index } = data || {};

  if (!action) {
    throw new HttpError(400, "Action is missing");
  }

  if (!network) {
    throw new HttpError(400, "Network is missing");
  }

  if (parentBountyIndex === undefined) {
    throw new HttpError(400, "Parent bounty index is missing");
  }

  if (index === undefined) {
    throw new HttpError(400, "Child bounty index is missing");
  }

  ctx.body = await childBountyService.updateChildBounty(
    action,
    network,
    parseInt(parentBountyIndex),
    parseInt(index),
    data,
    address,
    signature,
  );
}

async function getChildBounty(ctx) {
  const { network, parentBountyIndex, index } = ctx.params;

  if (!network) {
    throw new HttpError(400, "Network is missing");
  }

  if (parentBountyIndex === undefined) {
    throw new HttpError(400, "Parent bounty index is missing");
  }

  if (index === undefined) {
    throw new HttpError(400, "Child bounty index is missing");
  }

  ctx.body = await childBountyService.getChildBounty(
    network,
    parseInt(parentBountyIndex),
    parseInt(index),
  );
}

async function getChildBountyComments(ctx) {
  const { network, parentBountyIndex, index } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  if (!network) {
    throw new HttpError(400, "Network is missing");
  }

  if (parentBountyIndex === undefined) {
    throw new HttpError(400, "Parent bounty index is missing");
  }

  if (index === undefined) {
    throw new HttpError(400, "Child bounty index is missing");
  }

  ctx.body = await childBountyService.getChildBountyComments(
    network,
    parseInt(parentBountyIndex),
    parseInt(index),
    page,
    pageSize,
  );
}

module.exports = {
  getChildBounty,
  updateChildBounty,
  getChildBounties,
  importChildBounty,
  getChildBountyComments,
};
