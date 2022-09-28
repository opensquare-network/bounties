const { HttpError } = require("../utils/exc");
const { ChildBountyComment, ChildBounty } = require("../models");
const { extractMentions } = require("../utils/mention");
const { isSamePublicKey } = require("../utils/address");
const { createNotification } = require("./notification");
const { NotificationType } = require("../utils/constants");

async function createCommentNotification(comment) {
  const bountyIndexer = comment.bountyIndexer;
  const childBounty = await ChildBounty.findOne({
    network: bountyIndexer.network,
    parentBountyIndexer: bountyIndexer.parentBountyIndexer,
    index: bountyIndexer.index,
  });

  const mentions = extractMentions(comment.content);
  const notifications = mentions.map(item => ({ receiver: item.address, type: NotificationType.Mention }));
  if (!isSamePublicKey(childBounty.address, comment.address)) {
    const item = notifications.find(item => item.receiver === childBounty.address);
    if (item) {
      item.type = [NotificationType.Reply, NotificationType.Mention];
    } else {
      notifications.push({ receiver: childBounty.address, type: NotificationType.Reply });
    }
  }

  for (const { receiver, type } of notifications) {
    await createNotification(
      receiver,
      type,
      {
        childBountyComment: comment._id,
        byWho: {
          address: comment.address,
          network: comment.commenterNetwork,
        },
      }
    );
  }
}

async function postChildBountyComment(
  network,
  parentBountyIndex,
  index,
  content,
  commenterNetwork,
  data,
  address,
  signature,
) {
  // Check bounty
  const childBounty = await ChildBounty.findOne({
    network,
    parentBountyIndex,
    index,
  });
  if (!childBounty) {
    throw new HttpError(400, "Child bounty not found");
  }

  const comment = await ChildBountyComment.create({
    bountyIndexer: {
      network,
      parentBountyIndex,
      index,
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
  postChildBountyComment,
};
