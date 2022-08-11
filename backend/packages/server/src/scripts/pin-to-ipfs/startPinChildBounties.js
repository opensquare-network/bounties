const { ChildBounty } = require("../../models");
const { ipfsAdd } = require("../../services/ipfs.service");

async function pinOneChildBounty(childBounty) {
  try {
    const added = await ipfsAdd(childBounty.data);
    const pinHash = added?.cid?.toV1().toString();
    await ChildBounty.updateOne({ _id: childBounty._id }, { pinHash });
    console.log(`Pinned child bounty ${childBounty.title} at ${pinHash}`);
  } catch (e) {
    console.error(e);
  }
}

async function startPinChildBounties() {
  const childBounties = await ChildBounty.find({ pinHash: null }).limit(50);
  let promises = [];
  for (const childBounty of childBounties) {
    promises.push(pinOneChildBounty(childBounty));
  }

  await Promise.all(promises);
}

module.exports = {
  startPinChildBounties,
}
