const { HttpError } = require("../../../utils/exc");
const { Bounty } = require("../../../models");
const { closeBounty } = require("./closeBounty");
const { reopenBounty } = require("./reopenBounty");
const { editBounty } = require("./editBounty");
const { BountyActions } = require("../../../utils/constants");

async function updateBounty(
  action,
  network,
  bountyIndex,
  data,
  address,
  signature,
  logo,
) {
  const bounty = await Bounty.findOne({
    network,
    bountyIndex,
  });
  if (!bounty) {
    throw new HttpError(500, "Bounty not found");
  }

  let updatedBounty;
  if (action === BountyActions.CloseBounty) {
    updatedBounty = await closeBounty(bounty, action, data, address, signature);
  } else if (action === BountyActions.ReopenBounty) {
    updatedBounty = await reopenBounty(
      bounty,
      action,
      data,
      address,
      signature,
    );
  } else if (action === BountyActions.EditBounty) {
    updatedBounty = await editBounty(
      bounty,
      action,
      data,
      address,
      signature,
      logo,
    );
  } else {
    throw new HttpError(400, `Unknown action: ${action}`);
  }

  return updatedBounty;
}

module.exports = {
  updateBounty,
};
