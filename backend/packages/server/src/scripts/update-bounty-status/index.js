const dotenv = require("dotenv");
dotenv.config();

const { Bounty } = require("../../models");
const { BountyStatus } = require("../../utils/constants");
const { fetchBountyState } = require("./fetchBountyState");

async function updateBountyToClosed(bounty) {
  console.log(`Update status to Closed`);
  await Bounty.updateOne(
    { _id: bounty._id },
    {
      status: BountyStatus.Closed,
    },
  );
}

async function updateBountyStatus(bounty) {
  console.log(`Update bounty: ${bounty.network}/${bounty.bountyIndex}`);

  const { state } = await fetchBountyState(bounty.network, bounty.bountyIndex);

  if (["Canceled", "Cancelled", "Claimed"].includes(state)) {
    return await updateBountyToClosed(bounty);
  }
}

async function main() {
  console.log(`Start update at:`, new Date());

  const bounties = await Bounty.find({
    status: BountyStatus.Open,
  });

  console.log(`Updating ${bounties.length} bounties`);

  for (const bounty of bounties) {
    try {
      await updateBountyStatus(bounty);
    } catch (e) {
      console.error(e.message);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
