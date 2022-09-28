const { HttpError } = require("../utils/exc");
const { BountyComment, Bounty } = require("../models");
const { extractMentions } = require("../utils/mention");
const { isSamePublicKey } = require("../utils/address");
const { createNotification } = require("./notification");
const { NotificationType } = require("../utils/constants");

async function createCommentNotification(comment) {
  const bountyIndexer = comment.bountyIndexer;
  const bounty = await Bounty.findOne({
    network: bountyIndexer.network,
    bountyIndexer: bountyIndexer.bountyIndexer,
  });

  const mentions = extractMentions(comment.content);
  const notifications = mentions.map(item => ({ receiver: item.address, type: NotificationType.Mention }));
  if (!isSamePublicKey(bounty.address, comment.address)) {
    const item = notifications.find(item => item.receiver === bounty.address);
    if (item) {
      item.type = [NotificationType.Reply, NotificationType.Mention];
    } else {
      notifications.push({ receiver: bounty.address, type: NotificationType.Reply });
    }
  }

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
