const { Comment, Bounty } = require("../models");

async function postComment(
  indexer,
  content,
  commenterNetwork,
  data,
  address,
  signature
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
  }

  await Comment.create({
    indexer,
    content,
    commenterNetwork,
    data,
    address,
    signature,
  });

  return {
    result: true,
  };
}

module.exports = {
  postComment,
};
