const { HttpError } = require("../../../utils/exc");
const { ChildBounty } = require("../../../models");
const { resolveChildBounty } = require("./resolveChildBounty");
const { closeChildBounty } = require("./closeChildBounty");
const { reopenChildBounty } = require("./reopenChildBounty");
const { editChildBounty } = require("./editChildBounty");
const { ChildBountyActions } = require("../../../utils/constants");

async function updateChildBounty(
  action,
  network,
  parentBountyIndex,
  index,
  data,
  address,
  signature,
) {
  const childBounty = await ChildBounty.findOne({
    network,
    parentBountyIndex,
    index,
  });
  if (!childBounty) {
    throw new HttpError(500, "Child bounty not found");
  }

  let updatedChildBounty;
  if (action === ChildBountyActions.ResolveChildBounty) {
    updatedChildBounty = await resolveChildBounty(
      childBounty,
      action,
      data,
      address,
      signature,
    );
  } else if (action === ChildBountyActions.CloseChildBounty) {
    updatedChildBounty = await closeChildBounty(
      childBounty,
      action,
      data,
      address,
      signature,
    );
  } else if (action === ChildBountyActions.ReopenChildBounty) {
    updatedChildBounty = await reopenChildBounty(
      childBounty,
      action,
      data,
      address,
      signature,
    );
  } else if (action === ChildBountyActions.EditChildBounty) {
    updatedChildBounty = await editChildBounty(
      childBounty,
      action,
      data,
      address,
      signature,
    );
  } else {
    throw new HttpError(400, `Unknown action: ${action}`);
  }

  return updatedChildBounty;
}

module.exports = {
  updateChildBounty,
};
