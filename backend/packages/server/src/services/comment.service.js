const { HttpError } = require("../utils/exc");
const { Comment, Bounty, ChildBounty } = require("../models");

async function postComment(
  bountyIndexer,
  content,
  commenterNetwork,
  data,
  address,
  signature,
) {
  // Check bounty
  if (bountyIndexer.type === "bounty") {
    const bounty = await Bounty.findOne({
      network: bountyIndexer.network,
      bountyIndex: bountyIndexer.bountyIndex,
    });
    if (!bounty) {
      throw new HttpError(400, "Bounty not found");
    }
  } else if (index.type === "childBounty") {
    const childBounty = await ChildBounty.findOne({
      network: bountyIndexer.network,
      parentBountyIndex: bountyIndexer.bountyIndex,
      index: bountyIndexer.childBountyIndex,
    });
    if (!childBounty) {
      throw new HttpError(400, "Child bounty not found");
    }
  }

  await Comment.create({
    bountyIndexer,
    content,
    commenterNetwork,
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
  postComment,
};
