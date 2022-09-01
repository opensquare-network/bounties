const { HttpError } = require("../../../utils/exc");
const {
  ChildBounty,
  Application,
  ChildBountyTimeline,
  Notification,
} = require("../../../models");
const chainService = require("../../chain.service");
const {
  ChildBountyStatus,
  ApplicationStatus,
  NotificationType,
} = require("../../../utils/constants");
const { toPublicKey } = require("../../../utils/address");

async function resolveChildBounty(
  childBounty,
  action,
  data,
  address,
  signature,
) {
  if (![ChildBountyStatus.Assigned].includes(childBounty.status)) {
    throw new HttpError(400, "Incorrect child bounty status");
  }

  // Check if caller is bounty curator
  if (!childBounty.childBounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator can resolve");
  }

  const onchainChildBounty = await chainService.getChildBounty(
    childBounty.network,
    childBounty.parentBountyIndex,
    childBounty.index,
  );

  if (!onchainChildBounty) {
    throw new HttpError(400, `The child bounty is not found on chain`);
  }

  if (!onchainChildBounty.meta?.status?.pendingPayout) {
    throw new HttpError(400, `The child bounty is not awarded`);
  }

  const beneficiary = onchainChildBounty.meta?.status?.pendingPayout?.beneficiary;

  const updatedChildBounty = await ChildBounty.findOneAndUpdate(
    { _id: childBounty._id },
    {
      status: ChildBountyStatus.Awarded,
      beneficiary,
    },
    { new: true },
  );

  const timelineItem = await ChildBountyTimeline.create({
    bountyIndexer: {
      network: childBounty.network,
      parentBountyIndex: childBounty.parentBountyIndex,
      index: childBounty.index,
    },
    action,
    data,
    address,
    signature,
  });

  const applications = await Application.find({
    "bountyIndexer.network": childBounty.network,
    "bountyIndexer.parentBountyIndex": childBounty.parentBountyIndex,
    "bountyIndexer.index": childBounty.index,
    status: {
      $in: [
        ApplicationStatus.Assigned,
        ApplicationStatus.Started,
        ApplicationStatus.Submitted,
      ],
    },
  });

  const applicants = applications.map((item) => item.address);

  for (const applicant of applicants) {
    const notificationOwner = toPublicKey(applicant);
    await Notification.create({
      owner: notificationOwner,
      type: [NotificationType.ChildBountyResolved],
      read: false,
      data: {
        byWho: {
          address,
          network: childBounty.network,
        },
        childBountyTimelineItem: timelineItem._id,
      },
    });
  }

  return updatedChildBounty;
}

module.exports = {
  resolveChildBounty,
};
