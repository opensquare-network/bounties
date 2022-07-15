const dotenv = require("dotenv");
dotenv.config();

const { Bounty, Comment } = require("../models");
const { ipfsAdd } = require("../services/ipfs.service");

async function pinOneBounty(bounty) {
  try {
    const added = await ipfsAdd(bounty.data);
    const pinHash = added?.cid?.toV1().toString();
    await Bounty.updateOne({ _id: bounty._id }, { pinHash });
    console.log(`Pinned bounty ${bounty.title} at ${pinHash}`);
  } catch (e) {
    console.error(e);
  }
}

async function startPinBounties() {
  const bounties = await Bounty.find({ pinHash: null }).limit(50);
  let promises = [];
  for (const bounty of bounties) {
    promises.push(pinOneBounty(bounty));
  }

  await Promise.all(promises);
}

async function pinOneComment(comment) {
  try {
    const added = await ipfsAdd(comment.data);
    const pinHash = added?.cid?.toV1().toString();
    await Comment.updateOne({ _id: comment._id }, { pinHash });
    console.log(`Pinned comment ${comment._id} at ${pinHash}`);
  } catch (e) {
    console.error(e);
  }
}

async function startPinComments() {
  const comments = await Comment.find({ pinHash: null }).limit(50);
  let promises = [];
  for (const comment of comments) {
    promises.push(pinOneComment(comment));
  }

  await Promise.all(promises);
}

async function startPin() {
  return Promise.all([
    startPinBounties(),
    startPinComments(),
  ]);
}

async function main() {
  try {
    await startPin();
    console.log(`Last pin at:`, new Date());
  } catch (e) {
    console.error(e);
  }
}

main().finally(() => process.exit());
