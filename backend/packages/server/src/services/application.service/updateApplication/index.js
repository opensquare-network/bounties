const { HttpError } = require("../../../utils/exc");
const { ChildBounty, Application } = require("../../../models");
const { ChildBountyStatus, ApplicationActions } = require("../../../utils/constants");
const { evaluateChildBountyStatus } = require("../../child-bounty.service");
const { cancelApplication } = require("./cancelApplication");
const { assignApplication } = require("./assignedApplication");
const { unassignApplication } = require("./unassignedApplication");
const { acceptAssignment } = require("./acceptAssignment");
const { submitWork } = require("./submitWork");

async function updateApplication(
  action,
  bountyIndexer,
  applicantAddress,
  data,
  address,
  signature,
) {
  const childBounty = await ChildBounty.findOne({
    network: bountyIndexer.network,
    parentBountyIndex: bountyIndexer.parentBountyIndex,
    index: bountyIndexer.index,
  });
  if (!childBounty) {
    throw new HttpError(500, "Related bounty not found");
  }

  if (
    ![ChildBountyStatus.Open, ChildBountyStatus.Assigned].includes(
      childBounty.status,
    )
  ) {
    throw new HttpError(
      500,
      `Cannot update application on a ${childBounty.status} child bounty`,
    );
  }

  // Check application
  const application = await Application.findOne({
    "bountyIndexer.network": bountyIndexer.network,
    "bountyIndexer.parentBountyIndex": bountyIndexer.parentBountyIndex,
    "bountyIndexer.index": bountyIndexer.index,
    address: applicantAddress,
  });
  if (!application) {
    throw new HttpError(400, "Application is not found");
  }

  let updatedApplication;
  if (action === ApplicationActions.CancelApplication) {
    updatedApplication = await cancelApplication(
      childBounty,
      application,
      action,
      data,
      address,
      signature,
    );
  } else if (action === ApplicationActions.AssignApplication) {
    updatedApplication = await assignApplication(
      childBounty,
      application,
      action,
      data,
      address,
      signature,
    );
  } else if (action === ApplicationActions.UnassignApplication) {
    updatedApplication = await unassignApplication(
      childBounty,
      application,
      action,
      data,
      address,
      signature,
    );
  } else if (action === ApplicationActions.AcceptAssignment) {
    updatedApplication = await acceptAssignment(
      childBounty,
      application,
      action,
      data,
      address,
      signature,
    );
  } else if (action === ApplicationActions.SubmitWork) {
    updatedApplication = await submitWork(
      childBounty,
      application,
      action,
      data,
      address,
      signature,
    );
  } else {
    throw new HttpError(400, `Unknown action: ${action}`);
  }

  // Update child bounty status
  const newStatus = await evaluateChildBountyStatus(
    bountyIndexer.network,
    bountyIndexer.parentBountyIndex,
    bountyIndexer.index,
  );

  await ChildBounty.updateOne(
    {
      network: bountyIndexer.network,
      parentBountyIndex: bountyIndexer.parentBountyIndex,
      index: bountyIndexer.index,
    },
    {
      status: newStatus,
    },
  );

  return updatedApplication;
}

module.exports = {
  updateApplication,
};
