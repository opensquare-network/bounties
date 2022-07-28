const { HttpError } = require("../utils/exc");
const { ChildBounty, Application, ApplicationTimeline, Notification } = require("../models");
const {
  ApplicationStatus,
  ChildBountyStatus,
  NotificationType,
} = require("../utils/constants");
const { toPublicKey } = require("../utils/address");

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
    parentBountyIndex: bountyIndexer.bountyIndex,
    index: bountyIndexer.childBountyIndex,
  });
  if (!childBounty) {
    throw new HttpError(400, "Child bounty not found");
  }

  if (applicantNetwork !== childBounty.network) {
    throw new HttpError(400, "Applicant address network does not match");
  }

  const exists = await Application.findOne({
    "bountyIndexer.network": bountyIndexer.network,
    "bountyIndexer.bountyIndex": bountyIndexer.bountyIndex,
    "bountyIndexer.childBountyIndex": bountyIndexer.childBountyIndex,
    applicantNetwork,
  });
  if (exists) {
    throw new HttpError(400, "Application already exists");
  }

  await Application.create({
    bountyIndexer,
    description,
    applicantNetwork,
    data,
    address,
    signature,
    status: ApplicationStatus.Apply,
  });

  const timelineItem = await ApplicationTimeline.create({
    bountyIndexer,
    applicantAddress: address,
    action: "applyChildBounty",
    data,
    address,
    signature,
  });

  const notificationOwner = toPublicKey(childBounty.address);
  await Notification.create({
    owner: notificationOwner,
    type: [NotificationType.Applied],
    read: false,
    data: {
      byWho: {
        address,
        network: applicantNetwork,
      },
      applicationTimelineItem: timelineItem._id,
    },
  });

  // fixme: it's strange to return just {result: true}
  return {
    result: true,
  };
}

async function updateApplication(
  action,
  bountyIndexer,
  applicantAddress,
  data,
  address,
  signature,
) {
  // Check application
  const application = await Application.findOne({
    "bountyIndexer.network": bountyIndexer.network,
    "bountyIndexer.bountyIndex": bountyIndexer.bountyIndex,
    "bountyIndexer.childBountyIndex": bountyIndexer.childBountyIndex,
    address: applicantAddress,
  });
  if (!application) {
    throw new HttpError(400, "Application is not found");
  }

  const childBounty = await ChildBounty.findOne({
    network: application.bountyIndexer.network,
    parentBountyIndex: application.bountyIndexer.bountyIndex,
    index: application.bountyIndexer.childBountyIndex,
  });
  if (!childBounty) {
    throw new HttpError(500, "Related bounty not found");
  }

  if (action === "cancelApplication") {
    await cancelApplication(
      childBounty,
      application,
      action,
      data,
      address,
      signature,
    );
  } else if (action === "assignApplication") {
    await assignApplication(
      childBounty,
      application,
      action,
      data,
      address,
      signature,
    );
  } else if (action === "unassignApplication") {
    await unassignApplication(
      childBounty,
      application,
      action,
      data,
      address,
      signature,
    );
  } else if (action === "acceptAssignment") {
    await acceptAssignment(
      childBounty,
      application,
      action,
      data,
      address,
      signature,
    );
  } else if (action === "submitWork") {
    await submitWork(
      childBounty,
      application,
      action,
      data,
      address,
      signature,
    );
  }

  // Update child bounty status
  const allApplicationStatus = await Application.find({
    "bountyIndexer.network": bountyIndexer.network,
    "bountyIndexer.bountyIndex": bountyIndexer.bountyIndex,
    "bountyIndexer.childBountyIndex": bountyIndexer.childBountyIndex,
  }).distinct("status");

  let newStatus = ChildBountyStatus.Open;
  for (const status of [
    ApplicationStatus.WorkDone,
    ApplicationStatus.Submitted,
    ApplicationStatus.Started,
    ApplicationStatus.Assigned,
    ApplicationStatus.Apply,
  ]) {
    if (allApplicationStatus.includes(status)) {
      newStatus = status;
      break;
    }
  }

  await ChildBounty.updateOne(
    {
      network: bountyIndexer.network,
      parentBountyIndex: bountyIndexer.bountyIndex,
      index: bountyIndexer.childBountyIndex,
    },
    {
      status: newStatus,
    },
  );

  // fixme: it's strange to return just {result: true}
  return {
    result: true,
  };
}

async function cancelApplication(
  childBounty,
  application,
  action,
  data,
  address,
  signature,
) {
  if (
    ![ApplicationStatus.Apply, ApplicationStatus.Assigned].includes(
      application.status,
    )
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

  await Application.updateOne(
    { _id: application._id },
    { status: ApplicationStatus.Cancelled },
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
    type: [NotificationType.Cancelled],
    read: false,
    data: {
      byWho: {
        address,
        network: childBounty.network,
      },
      applicationTimelineItem: timelineItem._id,
    },
  });
}

async function submitWork(
  childBounty,
  application,
  action,
  data,
  address,
  signature,
) {
  if (application.status !== ApplicationStatus.Started) {
    throw new HttpError(400, "Incorrect application status");
  }

  // Check if caller is applicant
  if (application.address !== address) {
    throw new HttpError(403, "Only the owner is allow to submit work");
  }

  await Application.updateOne(
    { _id: application._id },
    { status: ApplicationStatus.Submitted },
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
}

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

  await Application.updateOne(
    { _id: application._id },
    { status: ApplicationStatus.Started },
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
}

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

  await Application.updateOne(
    { _id: application._id },
    { status: ApplicationStatus.Assigned },
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
    type: [NotificationType.Assigned],
    read: false,
    data: {
      byWho: {
        address,
        network: childBounty.network,
      },
      applicationTimelineItem: timelineItem._id,
    },
  });
}

async function unassignApplication(
  childBounty,
  application,
  action,
  data,
  address,
  signature,
) {
  if (
    ![ApplicationStatus.Assigned, ApplicationStatus.Started].includes(
      application.status,
    )
  ) {
    throw new HttpError(400, "Incorrect application status");
  }

  // Check if caller is bounty curator
  if (!childBounty.childBounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator is allow to unassign the work");
  }

  await Application.updateOne(
    { _id: application._id },
    { status: ApplicationStatus.Apply },
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
}

module.exports = {
  apply,
  updateApplication,
};
