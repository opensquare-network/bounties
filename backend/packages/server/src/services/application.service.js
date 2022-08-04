const { HttpError } = require("../utils/exc");
const {
  ChildBounty,
  Application,
  ApplicationTimeline,
  Notification,
} = require("../models");
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
    parentBountyIndex: bountyIndexer.parentBountyIndex,
    index: bountyIndexer.index,
  });
  if (!childBounty) {
    throw new HttpError(400, "Child bounty not found");
  }

  if (applicantNetwork !== childBounty.network) {
    throw new HttpError(400, "Applicant address network does not match");
  }

  if (childBounty.status === ChildBountyStatus.Awarded) {
    throw new HttpError(400, "Cannot apply after child bounty awarded");
  }

  const exists = await Application.findOne({
    "bountyIndexer.network": bountyIndexer.network,
    "bountyIndexer.parentBountyIndex": bountyIndexer.parentBountyIndex,
    "bountyIndexer.index": bountyIndexer.index,
    applicantNetwork,
  });
  if (exists) {
    throw new HttpError(400, "Application already exists");
  }

  const application = await Application.create({
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

  return application;
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
    "bountyIndexer.parentBountyIndex": bountyIndexer.parentBountyIndex,
    "bountyIndexer.index": bountyIndexer.index,
    address: applicantAddress,
  });
  if (!application) {
    throw new HttpError(400, "Application is not found");
  }

  const childBounty = await ChildBounty.findOne({
    network: application.bountyIndexer.network,
    parentBountyIndex: application.bountyIndexer.parentBountyIndex,
    index: application.bountyIndexer.index,
  });
  if (!childBounty) {
    throw new HttpError(500, "Related bounty not found");
  }

  let updatedApplication;
  if (action === "cancelApplication") {
    updatedApplication = await cancelApplication(
      childBounty,
      application,
      action,
      data,
      address,
      signature,
    );
  } else if (action === "assignApplication") {
    updatedApplication = await assignApplication(
      childBounty,
      application,
      action,
      data,
      address,
      signature,
    );
  } else if (action === "unassignApplication") {
    updatedApplication = await unassignApplication(
      childBounty,
      application,
      action,
      data,
      address,
      signature,
    );
  } else if (action === "acceptAssignment") {
    updatedApplication = await acceptAssignment(
      childBounty,
      application,
      action,
      data,
      address,
      signature,
    );
  } else if (action === "submitWork") {
    updatedApplication = await submitWork(
      childBounty,
      application,
      action,
      data,
      address,
      signature,
    );
  } else {
    throw new HttpError(400, `Unknown action: ${action}`);
  }

  // Update child bounty status
  const allApplicationStatus = await Application.find({
    "bountyIndexer.network": bountyIndexer.network,
    "bountyIndexer.parentBountyIndex": bountyIndexer.parentBountyIndex,
    "bountyIndexer.index": bountyIndexer.index,
  }).distinct("status");

  let newStatus = ChildBountyStatus.Open;
  for (const status of [
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
      parentBountyIndex: bountyIndexer.parentBountyIndex,
      index: bountyIndexer.index,
    },
    {
      status: newStatus,
    },
  );

  return updatedApplication;
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

  const updatedApplication = await Application.findOneAndUpdate(
    { _id: application._id },
    { status: ApplicationStatus.Cancelled },
    { new: true }
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

  return updatedApplication;
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

  const updatedApplication = await Application.findOneAndUpdate(
    { _id: application._id },
    { status: ApplicationStatus.Submitted },
    { new: true }
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
    { new: true }
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

  const updatedApplication = await Application.findOneAndUpdate(
    { _id: application._id },
    { status: ApplicationStatus.Assigned },
    { new: true }
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

  return updatedApplication;
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

  const updatedApplication = await Application.findOneAndUpdate(
    { _id: application._id },
    { status: ApplicationStatus.Apply },
    { new: true }
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
  apply,
  updateApplication,
};
