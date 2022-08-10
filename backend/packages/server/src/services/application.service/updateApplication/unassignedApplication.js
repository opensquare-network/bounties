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

async function unassignApplication(
  childBounty,
  application,
  action,
  data,
  address,
  signature,
) {
  if (
    ![
      ApplicationStatus.Assigned,
      ApplicationStatus.Started,
      ApplicationStatus.Submitted,
    ].includes(application.status)
  ) {
    throw new HttpError(400, "Incorrect application status");
  }

  // Check if caller is bounty curator
  if (!childBounty.childBounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator is allow to unassign the work");
  }

  const updatedApplication = await Application.findOneAndUpdate(
    { _id: application._id },
    { status: ApplicationStatus.Apply },
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

  const notificationOwner = toPublicKey(application.address);
  await Notification.create({
    owner: notificationOwner,
    type: [NotificationType.Unassigned],
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
  unassignApplication,
};
