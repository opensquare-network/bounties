const { HttpError } = require("../../../utils/exc");
const {
  Application,
  ApplicationTimeline,
  Notification,
} = require("../../../models");
const {
  ApplicationStatus,
  NotificationType,
} = require("../../../utils/constants");
const { toPublicKey } = require("../../../utils/address");

async function acceptAssignment(
  childBounty,
  application,
  action,
  data,
  address,
  signature,
) {
  if (application.status !== ApplicationStatus.Assigned) {
    throw new HttpError(400, "Incorrect application status");
  }

  // Check if caller is applicant
  if (application.address !== address) {
    throw new HttpError(403, "Only the owner is allow to accept the work");
  }

  const updatedApplication = await Application.findOneAndUpdate(
    { _id: application._id },
    { status: ApplicationStatus.Started },
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

  const notificationOwner = toPublicKey(childBounty.address);
  await Notification.create({
    owner: notificationOwner,
    type: [NotificationType.Accepted],
    read: false,
    data: {
      byWho: {
        address,
        network: childBounty.network,
      },
      applicationTimelineItem: timelineItem._id,
    },
  });

  return updatedApplication;
}

module.exports = {
  acceptAssignment,
};