const { HttpError } = require("../utils/exc");
const { ChildBountyComment, ChildBounty } = require("../models");
const { createNotification } = require("./notification");
const { getCommentNotifications } = require("./common");

async function createCommentNotification(comment) {
  const bountyIndexer = comment.bountyIndexer;
  const childBounty = await ChildBounty.findOne({
    network: bountyIndexer.network,
    parentBountyIndexer: bountyIndexer.parentBountyIndexer,
    index: bountyIndexer.index,
  });

  const notifications = getCommentNotifications(childBounty.address, comment);
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
