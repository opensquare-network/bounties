const { HttpError } = require("../utils/exc");
const { BountyComment, Bounty } = require("../models");
const { createNotification } = require("./notification");
const { getCommentNotifications } = require("./common");

async function createCommentNotification(comment) {
  const bountyIndexer = comment.bountyIndexer;
  const bounty = await Bounty.findOne({
    network: bountyIndexer.network,
    bountyIndexer: bountyIndexer.bountyIndexer,
  });

  const notifications = getCommentNotifications(bounty.address, comment);
  for (const { receiver, type } of notifications) {
    await createNotification(
      receiver,
      type,
      {
        bountyComment: comment._id,
        byWho: {
          address: comment.address,
          network: comment.commenterNetwork,
        },
      }
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

  return comment;
}

module.exports = {
  postBountyComment,
};
