const { Bounty } = require("../../models");
const { ipfsAdd } = require("../../services/ipfs.service");

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

module.exports = {
  startPinBounties,
};
