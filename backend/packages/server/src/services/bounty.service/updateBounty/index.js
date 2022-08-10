const { HttpError } = require("../../../utils/exc");
const { Bounty } = require("../../../models");
const { closeBounty } = require("./closeBounty");
const { reopenBounty } = require("./reopenBounty");

async function updateBounty(
  action,
  network,
  bountyIndex,
  data,
  address,
  signature,
) {
  const bounty = await Bounty.findOne({
    network,
    bountyIndex,
  });
  if (!bounty) {
    throw new HttpError(500, "Bounty not found");
  }

  let updatedBounty;
  if (action === "closeBounty") {
    updatedBounty = await closeBounty(bounty, action, data, address, signature);
  } else if (action === "reopenBounty") {
    updatedBounty = await reopenBounty(
      bounty,
      action,
      data,
      address,
      signature,
    );
  } else {
    throw new HttpError(400, `Unknown action: ${action}`);
  }

  return updatedBounty;
}

module.exports = {
  updateBounty,
};
