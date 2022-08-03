const { HttpError } = require("../utils/exc");
const { ChildBountyComment, ChildBounty, Notification } = require("../models");
const { extractMentions } = require("../utils/mention");
const { toPublicKey, isSamePublicKey } = require("../utils/address");

async function createCommentNotification(comment) {
  const bountyIndexer = comment.bountyIndexer;
  const childBounty = await ChildBounty.findOne({
    network: bountyIndexer.network,
    parentBountyIndexer: bountyIndexer.parentBountyIndexer,
    index: bountyIndexer.index,
  });

  if (!isSamePublicKey(childBounty.address, comment.address)) {
    const owner = toPublicKey(childBounty.address);
    await Notification.create({
      owner,
      type: ["reply"],
      read: false,
      data: {
        childBountyComment: comment._id,
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
        "data.childBountyComment": comment._id,
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

  // fixme: it's strange to return just {result: true}
  return {
    result: true,
  };
}

module.exports = {
  postChildBountyComment,
};
