const { HttpError } = require("../utils/exc");
const { ChildBounty, Application } = require("../models");

async function apply(
  bountyIndexer,
  description,
  applicantNetwork,
  data,
  address,
  signature,
) {
  // Check bounty
  const childBounty = await ChildBounty.findOne({
    network: bountyIndexer.network,
    parentBountyIndex: bountyIndexer.bountyIndex,
    index: bountyIndexer.childBountyIndex,
  });
  if (!childBounty) {
    throw new HttpError(400, "Child bounty not found");
  }

  await Application.create({
    bountyIndexer,
    description,
    applicantNetwork,
    data,
    address,
    signature,
  });

  // fixme: it's strange to return just {result: true}
  return {
    result: true,
  };
}

module.exports = {
  apply,
};
