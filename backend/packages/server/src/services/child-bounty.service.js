const { HttpError } = require("../utils/exc");
const {
  ChildBounty,
  ChildBountyComment,
  Application,
  Bounty,
  ChildBountyTimeline,
  Notification,
} = require("../models");
const chainService = require("./chain.service");
const {
  ChildBountyStatus,
  ApplicationStatus,
  BountyStatus,
  NotificationType,
} = require("../utils/constants");
const { toPublicKey } = require("../utils/address");

async function getChildBounties(page, pageSize) {
  const q = {};
  const total = await ChildBounty.countDocuments(q);
  const items = await ChildBounty.find(q)
    .skip((page - 1) * pageSize)
    .limit(pageSize);
  return {
    items,
    total,
    page,
    pageSize,
  };
}

async function getChildBounty(network, parentBountyIndex, index) {
  const childBounty = await ChildBounty.findOne({
    network,
    parentBountyIndex,
    index,
  })
    .populate({
      path: "parentBounty",
      select: "bountyIndex network title logo logoUrl",
    })
    .populate({
      path: "applications",
      select: "bountyIndexer description address status createdAt updatedAt",
    });

  if (!childBounty) {
    throw new HttpError(404, "Child bounty not found");
  }

  return childBounty.toJSON();
}

async function importChildBounty(
  network,
  parentBountyIndex,
  index,
  title,
  content,
  skills,
  data,
  address,
  signature,
) {
  const parentBounty = await Bounty.findOne({
    network,
    bountyIndex: parentBountyIndex,
  });
  if (!parentBounty) {
    throw new HttpError(400, "Parent bounty has not imported yet");
  }

  if (parentBounty.status === BountyStatus.Closed) {
    throw new HttpError(400, "Parent bounty has been closed");
  }

  const exists = await ChildBounty.exists({
    network,
    parentBountyIndex,
    index,
  });
  if (exists) {
    throw new HttpError(400, "Child bounty is already imported");
  }

  const childBounty = await chainService.getChildBounty(
    network,
    parentBountyIndex,
    index,
  );
  if (!childBounty) {
    throw new HttpError(404, `Can not find child bounty ${index} on chain`);
  }

  if (!childBounty.meta?.status?.active) {
    throw new HttpError(400, `Can import active child bounty only`);
  }

  if (childBounty.curators.length === 0) {
    throw new HttpError(403, "Can not find child bounty curator");
  }

  if (!childBounty.curators.includes(address)) {
    throw new HttpError(
      403,
      "Only curator is allowed to import the child bounty",
    );
  }

  return await ChildBounty.create({
    network,
    parentBountyIndex,
    index,
    title,
    content,
    skills,
    childBounty,
    data,
    address,
    signature,
    status: ChildBountyStatus.Open,
  });
}

async function getChildBountyComments(
  network,
  parentBountyIndex,
  index,
  page,
  pageSize,
) {
  const q = {
    "bountyIndexer.network": network,
    "bountyIndexer.parentBountyIndex": parentBountyIndex,
    "bountyIndexer.index": index,
  };

  const total = await ChildBountyComment.count(q);
  const comments = await ChildBountyComment.find(q)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  return {
    items: comments,
    page,
    pageSize,
    total,
  };
}

async function updateChildBounty(
  action,
  network,
  parentBountyIndex,
  index,
  data,
  address,
  signature,
) {
  const childBounty = await ChildBounty.findOne({
    network,
    parentBountyIndex,
    index,
  });
  if (!childBounty) {
    throw new HttpError(500, "Child bounty not found");
  }

  let updatedChildBounty;
  if (action === "resolveChildBounty") {
    updatedChildBounty = await resolveChildBounty(
      childBounty,
      action,
      data,
      address,
      signature,
    );
  } else if (action === "closeChildBounty") {
    updatedChildBounty = await closeChildBounty(
      childBounty,
      action,
      data,
      address,
      signature,
    );
  } else if (action === "reopenChildBounty") {
    updatedChildBounty = await reopenChildBounty(
      childBounty,
      action,
      data,
      address,
      signature,
    );
  } else {
    throw new HttpError(400, `Unknown action: ${action}`);
  }

  return updatedChildBounty;
}

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

  if (onchainChildBounty && !onchainChildBounty.meta?.status?.pendingPayout) {
    throw new HttpError(400, `The child bounty is not awarded`);
  }

  const updatedChildBounty = await ChildBounty.findOneAndUpdate(
    { _id: childBounty._id },
    { status: ChildBountyStatus.Awarded },
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
    const notificationOwner = toPublicKey(applicant);
    await Notification.create({
      owner: notificationOwner,
      type: [NotificationType.ChildBountyClosed],
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

async function reopenChildBounty(
  childBounty,
  action,
  data,
  address,
  signature,
) {
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
  const newStatus = await evaluteChildBountyStatus(
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

async function evaluteChildBountyStatus(network, parentBountyIndex, index) {
  // Update child bounty status
  const allApplicationStatus = await Application.find({
    "bountyIndexer.network": network,
    "bountyIndexer.parentBountyIndex": parentBountyIndex,
    "bountyIndexer.index": index,
  }).distinct("status");

  let result = ChildBountyStatus.Open;
  for (const status of [
    ApplicationStatus.Submitted,
    ApplicationStatus.Started,
    ApplicationStatus.Assigned,
  ]) {
    if (allApplicationStatus.includes(status)) {
      result = ChildBountyStatus.Assigned;
      break;
    }
  }

  return result;
}

module.exports = {
  importChildBounty,
  updateChildBounty,
  getChildBounties,
  getChildBounty,
  getChildBountyComments,
  evaluteChildBountyStatus,
};
