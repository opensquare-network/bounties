const { ChildBountyComment } = require("../../models");
const { ipfsAdd } = require("../../services/ipfs.service");

async function pinOneChildBountyComment(comment) {
  try {
    const added = await ipfsAdd(comment.data);
    const pinHash = added?.cid?.toV1().toString();
    await ChildBountyComment.updateOne({ _id: comment._id }, { pinHash });
    console.log(`Pinned comment ${comment._id} at ${pinHash}`);
  } catch (e) {
    console.error(e);
  }
}

async function startPinChildBountyComments() {
  const comments = await ChildBountyComment.find({ pinHash: null }).limit(50);
  let promises = [];
  for (const comment of comments) {
    promises.push(pinOneChildBountyComment(comment));
  }

  await Promise.all(promises);
}

module.exports = {
  startPinChildBountyComments,
};
