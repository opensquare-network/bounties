const { HttpError } = require("../../../utils/exc");
const {
  ChildBounty,
  Application,
  ChildBountyTimeline,
  Notification,
  Bounty,
} = require("../../../models");
const chainService = require("../../chain.service");
const {
  ChildBountyStatus,
  ApplicationStatus,
  NotificationType,
  BountyStatus,
} = require("../../../utils/constants");
const { toPublicKey } = require("../../../utils/address");
const { evaluateChildBountyStatus } = require("../evaluateChildBountyStatus");

async function reopenChildBounty(
  childBounty,
  action,
  data,
  address,
  signature,
) {
  const parentBounty = await Bounty.findOne({
    network: childBounty.network,
    bountyIndex: childBounty.parentBountyIndex
  });
  if (!parentBounty) {
    throw new HttpError(400, "Parent bounty not found");
  }

  if (parentBounty.status === BountyStatus.Closed) {
    throw new HttpError(400, "Cannot reopen due to the parent bounty is closed");
  }

  if (![ChildBountyStatus.Closed].includes(childBounty.status)) {
    throw new HttpError(400, 'Can reopen child bounty on "closed" status only');
  }

  const onchainChildBounty = await chainService.getChildBounty(
    childBounty.network,
    childBounty.parentBountyIndex,
    childBounty.index,
  );
  if (!onchainChildBounty) {
    throw new HttpError(
      404,
      `Can not find child bounty ${childBounty.index} on chain`,
    );
  }

  if (!onchainChildBounty.meta?.status?.active) {
    throw new HttpError(400, `Can reopen active child bounty only`);
  }

  // Check if caller is bounty curator
  if (!childBounty.childBounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator can reopen");
  }

  // Find current status
  const newStatus = await evaluateChildBountyStatus(
    childBounty.network,
    childBounty.parentBountyIndex,
    childBounty.index,
  );

  const updatedChildBounty = await ChildBounty.findOneAndUpdate(
    { _id: childBounty._id },
    { status: newStatus },
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
      $nin: [ApplicationStatus.Closed],
    },
  });

  const applicants = applications.map((item) => item.address);

  for (const applicant of applicants) {
    const notificationOwner = toPublicKey(applicant);
    await Notification.create({
      owner: notificationOwner,
      type: [NotificationType.ChildBountyReopen],
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
  reopenChildBounty,
};
