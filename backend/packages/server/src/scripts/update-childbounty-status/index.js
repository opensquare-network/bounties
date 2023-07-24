const dotenv = require("dotenv");
dotenv.config();

const { ChildBounty } = require("../../models");
const { ChildBountyStatus } = require("../../utils/constants");
const { fetchChildBountyState } = require("./fetchChildBountyState");

async function updateChildBountyToAwarded(childBounty, beneficiary) {
  console.log(`Update status to Awarded`);
  await ChildBounty.updateOne(
    { _id: childBounty._id },
    {
      beneficiary,
      status: ChildBountyStatus.Awarded,
    },
  );
}

async function updateChildBountyToClosed(childBounty) {
  console.log(`Update status to Closed`);
  await ChildBounty.updateOne(
    { _id: childBounty._id },
    {
      status: ChildBountyStatus.Closed,
    },
  );
}

async function updateChildBountyStatus(childBounty) {
  console.log(
    `Update child bounty: ${childBounty.network}/${childBounty.parentBountyIndex}/${childBounty.index}`,
  );

  const { beneficiary, state } = await fetchChildBountyState(
    childBounty.network,
    childBounty.parentBountyIndex,
    childBounty.index,
  );

  if (["Awarded", "Claimed"].includes(state)) {
    return await updateChildBountyToAwarded(childBounty, beneficiary);
  }

  if (["Canceled", "Cancelled"].includes(state)) {
    return await updateChildBountyToClosed(childBounty);
  }
}

async function main() {
  console.log(`Start update at:`, new Date());

  const childBounties = await ChildBounty.find({
    status: {
      $in: [ChildBountyStatus.Open, ChildBountyStatus.Assigned],
    },
  });

  console.log(`Updating ${childBounties.length} child bounties`);

  for (const childBounty of childBounties) {
    try {
      await updateChildBountyStatus(childBounty);
    } catch (e) {
      console.error(e.message);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
