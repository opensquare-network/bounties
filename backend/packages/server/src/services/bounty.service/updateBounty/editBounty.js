const { HttpError } = require("../../../utils/exc");
const { Bounty } = require("../../../models");
const { BountyStatus } = require("../../../utils/constants");
const { pinFile } = require("../pinFile");

async function editBounty(bounty, action, data, address, signature, logo) {
  if (![BountyStatus.Open].includes(bounty.status)) {
    throw new HttpError(400, 'Can edit bounty on "open" status only');
  }

  // Check if caller is bounty curator
  if (!bounty.bounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator can edit");
  }

  const { title, content } = data || {};
  if (!title) {
    throw new HttpError(400, "Title is missing");
  }

  if (!content) {
    throw new HttpError(400, "Content is missing");
  }

  let logoCid;
  if (logo) {
    try {
      logoCid = await pinFile(logo);
    } catch (e) {
      throw new HttpError(500, "Failed to pin logo to IPFS");
    }
  }

  const updatedBounty = await Bounty.findOneAndUpdate(
    { _id: bounty._id },
    { title, content, data, logo: logoCid },
    { new: true },
  );

  return updatedBounty;
}

module.exports = {
  editBounty,
};
