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

async function cancelApplication(
  childBounty,
  application,
  action,
  data,
  address,
  signature,
) {
  if (
    ![
      ApplicationStatus.Apply,
      ApplicationStatus.Assigned,
      ApplicationStatus.Started,
      ApplicationStatus.Submitted,
    ].includes(application.status)
  ) {
    throw new HttpError(400, "Incorrect application status");
  }

  // Check if caller is applicant
  if (application.address !== address) {
    throw new HttpError(
      403,
      "Only the owner is allow to cancel the application",
    );
  }

  const updatedApplication = await Application.findOneAndUpdate(
    { _id: application._id },
    { status: ApplicationStatus.Canceled },
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
    childBounty.address,
    NotificationType.Canceled,
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
  cancelApplication,
};
