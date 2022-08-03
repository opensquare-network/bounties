const { HttpError } = require("../utils/exc");
const { BountyComment, Bounty, Notification } = require("../models");
const { extractMentions } = require("../utils/mention");
const { toPublicKey, isSamePublicKey } = require("../utils/address");

async function createCommentNotification(comment) {
  const bountyIndexer = comment.bountyIndexer;
  const bounty = await Bounty.findOne({
    network: bountyIndexer.network,
    bountyIndexer: bountyIndexer.bountyIndexer,
  });

  if (!isSamePublicKey(bounty.address, comment.address)) {
    const owner = toPublicKey(bounty.address);
    await Notification.create({
      owner,
      type: ["reply"],
      data: {
        bountyComment: comment._id,
        byWho: {
          address: comment.address,
          network: comment.commenterNetwork,
        },
      },
    });
  }

  const mentions = extractMentions(comment.content);
  for (const mention of mentions) {
    const owner = toPublicKey(mention.address);
    await Notification.updateOne(
      {
        owner,
        "data.bountyComment": comment._id,
      },
      {
        $addToSet: {
          type: "mention",
        },
        $set: {
          "data.byWho": {
            address: comment.address,
            network: comment.commenterNetwork,
          },
        },
      },
      { upsert: true },
    );
  }
}

async function postBountyComment(
  network,
  bountyIndex,
  content,
  commenterNetwork,
  data,
  address,
  signature,
) {
  // Check bounty
  const bounty = await Bounty.findOne({
    network,
    bountyIndex,
  });
  if (!bounty) {
    throw new HttpError(400, "Bounty not found");
  }

  const comment = await BountyComment.create({
    bountyIndexer: {
      network,
      bountyIndex,
    },
    content,
    commenterNetwork,
    data,
    address,
    signature,
  });

  await createCommentNotification(comment);

  // fixme: it's strange to return just {result: true}
  return {
    result: true,
  };
}

module.exports = {
  postBountyComment,
};
