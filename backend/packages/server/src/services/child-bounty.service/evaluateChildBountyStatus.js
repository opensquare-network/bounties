const { Application } = require("../../models");
const {
  ChildBountyStatus,
  ApplicationStatus,
} = require("../../utils/constants");

async function evaluateChildBountyStatus(network, parentBountyIndex, index) {
  // Update child bounty status
  const allApplicationStatus = await Application.find({
    "bountyIndexer.network": network,
    "bountyIndexer.parentBountyIndex": parentBountyIndex,
    "bountyIndexer.index": index,
  }).distinct("status");

  let result = ChildBountyStatus.Open;
  for (const status of [
    ApplicationStatus.Submitted,
    ApplicationStatus.Started,
    ApplicationStatus.Assigned,
  ]) {
    if (allApplicationStatus.includes(status)) {
      result = ChildBountyStatus.Assigned;
      break;
    }
  }

  return result;
}

module.exports = {
  evaluateChildBountyStatus,
};
