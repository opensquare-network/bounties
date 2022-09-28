const { HttpError } = require("../../../utils/exc");
const {
  Application,
  ApplicationTimeline,
} = require("../../../models");
const {
  ApplicationStatus,
  NotificationType,
} = require("../../../utils/constants");
const { createNotification } = require("../../notification");

async function assignApplication(
  childBounty,
  application,
  action,
  data,
  address,
  signature,
) {
  if (application.status !== ApplicationStatus.Apply) {
    throw new HttpError(400, "Incorrect application status");
  }

  // Check if caller is bounty curator
  if (!childBounty.childBounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator is allow to assign the work");
  }

  const updatedApplication = await Application.findOneAndUpdate(
    { _id: application._id },
    { status: ApplicationStatus.Assigned },
    { new: true },
  );

  const timelineItem = await ApplicationTimeline.create({
    bountyIndexer: application.bountyIndexer,
    applicantAddress: application.address,
    action,
    data,
    address,
    signature,
  });

  await createNotification(
    application.address,
    NotificationType.Assigned,
    {
      byWho: {
        address,
        network: childBounty.network,
      },
      applicationTimelineItem: timelineItem._id,
    }
  );

  return updatedApplication;
}

module.exports = {
  assignApplication,
};
