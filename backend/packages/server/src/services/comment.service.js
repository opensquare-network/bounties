const { HttpError } = require("../utils/exc");
const { Comment, Bounty, ChildBounty } = require("../models");

async function postComment(
  indexer,
  content,
  commenterNetwork,
  data,
  address,
  signature,
) {
  // Check bounty
  if (indexer.type === "bounty") {
    const bounty = await Bounty.findOne({
      network: indexer.network,
      bountyIndex: indexer.bountyIndex,
    });
    if (!bounty) {
      throw new HttpError(400, "Bounty not found");
    }
  } else if (index.type === "childBounty") {
    const childBounty = await ChildBounty.findOne({
      network: indexer.network,
      parentBountyIndex: indexer.bountyIndex,
      index: indexer.childBountyIndex,
    });
    if (!childBounty) {
      throw new HttpError(400, "Child bounty not found");
    }
  }

  await Comment.create({
    indexer,
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
