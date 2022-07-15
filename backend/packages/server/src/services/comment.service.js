const { HttpError } = require("../utils/exc");
const { Comment, Bounty } = require("../models");
const { ipfsAdd } = require("./ipfs.service");

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

  const comment = await Comment.create({
    indexer,
    content,
    commenterNetwork,
    data,
    address,
    signature,
  });

  // Upload data to IPFS
  try {
    const added = await ipfsAdd(data);
    const pinHash = added?.cid?.toV1().toString();
    await Comment.updateOne({ _id: comment._id }, { pinHash });
  } catch (err) {
    console.error(err);
  }

  return {
    result: true,
  };
}

module.exports = {
  postComment,
};
