const { HttpError } = require("../../utils/exc");
const { Bounty } = require("../../models");
const chainService = require("../chain.service");
const { ipfsAddBuffer } = require("../ipfs.service");
const { BountyStatus } = require("../../utils/constants");

async function pinFile(file) {
  const fileData = file.buffer;
  const Megabyte = 1024 * 1024;
  if (file.size > 10 * Megabyte) {
    throw new HttpError(
      400,
      "The upload file has exceeded the size limitation",
    );
  }

  const result = await ipfsAddBuffer(fileData);
  const cid = result.path;
  return cid;
}

async function importBounty(
  network,
  bountyIndex,
  logo,
  title,
  content,
  data,
  address,
  signature,
) {
  const exists = await Bounty.exists({ network, bountyIndex });
  if (exists) {
    throw new HttpError(400, "Bounty is already imported");
  }

  const bounty = await chainService.getBounty(network, bountyIndex);
  if (!bounty) {
    throw new HttpError(404, `Can not find bounty ${bountyIndex} on chain`);
  }

  if (!bounty.meta?.status?.active) {
    throw new HttpError(404, `Can import active bounty only`);
  }

  if (bounty.curators.length === 0) {
    throw new HttpError(403, "Can not find bounty curator");
  }

  if (!bounty.curators.includes(address)) {
    throw new HttpError(403, "Only curator is allowed to import the bounty");
  }

  let logoCid;
  if (logo) {
    logoCid = await pinFile(logo);
  }

  return await Bounty.create({
    network,
    bountyIndex,
    logo: logoCid,
    title,
    content,
    bounty,
    data,
    address,
    signature,
    status: BountyStatus.Open,
  });
}

module.exports = {
  importBounty,
};
