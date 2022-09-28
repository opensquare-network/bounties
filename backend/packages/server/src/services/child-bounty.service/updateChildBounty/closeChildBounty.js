const { HttpError } = require("../../../utils/exc");
const {
  ChildBounty,
  Application,
  ChildBountyTimeline,
} = require("../../../models");
const {
  ChildBountyStatus,
  ApplicationStatus,
  NotificationType,
} = require("../../../utils/constants");
const { createNotification } = require("../../notification");

async function closeChildBounty(childBounty, action, data, address, signature) {
  if (![ChildBountyStatus.Open].includes(childBounty.status)) {
    throw new HttpError(400, 'Can close child bounty on "open" status only');
  }

  // Check if caller is bounty curator
  if (!childBounty.childBounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator can close");
  }

  const updatedChildBounty = await ChildBounty.findOneAndUpdate(
    { _id: childBounty._id },
    { status: ChildBountyStatus.Closed },
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
    await createNotification(
      applicant,
      NotificationType.ChildBountyClosed,
      {
        byWho: {
          address,
          network: childBounty.network,
        },
        childBountyTimelineItem: timelineItem._id,
      }
    );
  }

  return updatedChildBounty;
}

module.exports = {
  closeChildBounty,
};
