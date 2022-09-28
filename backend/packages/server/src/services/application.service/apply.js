const { HttpError } = require("../../utils/exc");
const {
  ChildBounty,
  Application,
  ApplicationTimeline,
} = require("../../models");
const {
  ApplicationStatus,
  ChildBountyStatus,
  NotificationType,
  ApplicationActions,
} = require("../../utils/constants");

async function apply(
  bountyIndexer,
  description,
  applicantNetwork,
  data,
  address,
  signature,
) {
  // Check bounty
  const childBounty = await ChildBounty.findOne({
    network: bountyIndexer.network,
    parentBountyIndex: bountyIndexer.parentBountyIndex,
    index: bountyIndexer.index,
  });
  if (!childBounty) {
    throw new HttpError(400, "Child bounty not found");
  }

  if (applicantNetwork !== childBounty.network) {
    throw new HttpError(400, "Applicant address network does not match");
  }

  if (
    ![ChildBountyStatus.Open, ChildBountyStatus.Assigned].includes(
      childBounty.status,
    )
  ) {
    throw new HttpError(
      500,
      `Cannot apply on a ${childBounty.status} child bounty`,
    );
  }

  const exists = await Application.findOne({
    "bountyIndexer.network": bountyIndexer.network,
    "bountyIndexer.parentBountyIndex": bountyIndexer.parentBountyIndex,
    "bountyIndexer.index": bountyIndexer.index,
    address,
  });
  if (exists && exists.status !== ApplicationStatus.Canceled) {
    throw new HttpError(400, "Application already exists");
  }

  const application = await Application.findOneAndUpdate(
    {
      "bountyIndexer.network": bountyIndexer.network,
      "bountyIndexer.parentBountyIndex": bountyIndexer.parentBountyIndex,
      "bountyIndexer.index": bountyIndexer.index,
      address,
    },
    {
      description,
      applicantNetwork,
      data,
      signature,
      status: ApplicationStatus.Apply,
    },
    { upsert: true, new: true },
  );

  const timelineItem = await ApplicationTimeline.create({
    bountyIndexer,
    applicantAddress: address,
    action: ApplicationActions.ApplyChildBounty,
    data,
    address,
    signature,
  });

  await createNotification(
    childBounty.address,
    NotificationType.Applied,
    {
      byWho: {
        address,
        network: applicantNetwork,
      },
      applicationTimelineItem: timelineItem._id,
    }
  );

  return application;
}

module.exports = {
  apply,
};
