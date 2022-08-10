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

async function submitWork(
  childBounty,
  application,
  action,
  data,
  address,
  signature,
) {
  if (
    ![ApplicationStatus.Started, ApplicationStatus.Submitted].includes(
      application.status,
    )
  ) {
    throw new HttpError(400, "Incorrect application status");
  }

  // Check if caller is applicant
  if (application.address !== address) {
    throw new HttpError(403, "Only the owner is allow to submit work");
  }

  const { description, link } = data || {};
  if (!description) {
    throw new HttpError(400, "Description must not be empty");
  }

  const updatedApplication = await Application.findOneAndUpdate(
    { _id: application._id },
    {
      status: ApplicationStatus.Submitted,
      submission: {
        description,
        link,
      },
    },
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
    type: [NotificationType.Submitted],
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
  submitWork,
};
