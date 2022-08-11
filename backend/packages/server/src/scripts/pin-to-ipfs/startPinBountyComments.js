const { BountyComment } = require("../../models");
const { ipfsAdd } = require("../../services/ipfs.service");

async function pinOneBountyComment(comment) {
  try {
    const added = await ipfsAdd(comment.data);
    const pinHash = added?.cid?.toV1().toString();
    await BountyComment.updateOne({ _id: comment._id }, { pinHash });
    console.log(`Pinned comment ${comment._id} at ${pinHash}`);
  } catch (e) {
    console.error(e);
  }
}

async function startPinBountyComments() {
  const comments = await BountyComment.find({ pinHash: null }).limit(50);
  let promises = [];
  for (const comment of comments) {
    promises.push(pinOneBountyComment(comment));
  }

  await Promise.all(promises);
}

module.exports = {
  startPinBountyComments,
};
