const { HttpError } = require("../utils/exc");
const { ChildBounty, Application, ApplicationTimeline } = require("../models");

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

  await Application.create({
    bountyIndexer,
    description,
    applicantNetwork,
    data,
    address,
    signature,
    status: "apply",
  });

  await ApplicationTimeline.create({
    bountyIndexer,
    applicantAddress: address,
    action: "applyChildBounty",
    data,
    address,
    signature,
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

  if (action === "cancelApplication") {
    await cancelApplication(application, action, data, address, signature);
  } else if (action === "assignApplication") {
    await assignApplication(application, action, data, address, signature);
  } else if (action === "unassignApplication") {
    await unassignApplication(application, action, data, address, signature);
  } else if (action === "acceptAssignment") {
    await acceptAssignment(application, action, data, address, signature);
  } else if (action === "submitWork") {
    await submitWork(application, action, data, address, signature);
  }

  // Update child bounty status
  const allApplicationStatus = await Application.find({
    "bountyIndexer.network": bountyIndexer.network,
    "bountyIndexer.bountyIndex": bountyIndexer.bountyIndex,
    "bountyIndexer.childBountyIndex": bountyIndexer.childBountyIndex,
  }).distinct("status");

  let newStatus = "open";
  for (const status of [
    "workDone",
    "submitted",
    "started",
    "assigned",
    "apply",
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
  application,
  action,
  data,
  address,
  signature,
) {
  if (!["apply", "assigned"].includes(application.status)) {
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
    { status: "cancelled" },
  );

  await ApplicationTimeline.create({
    bountyIndexer: application.bountyIndexer,
    applicantAddress: application.address,
    action,
    data,
    address,
    signature,
  });
}

async function submitWork(application, action, data, address, signature) {
  if (application.status !== "started") {
    throw new HttpError(400, "Incorrect application status");
  }

  // Check if caller is applicant
  if (application.address !== address) {
    throw new HttpError(403, "Only the owner is allow to submit work");
  }

  await Application.updateOne(
    { _id: application._id },
    { status: "submitted" },
  );

  await ApplicationTimeline.create({
    bountyIndexer: application.bountyIndexer,
    applicantAddress: application.address,
    action,
    data,
    address,
    signature,
  });
}

async function acceptAssignment(application, action, data, address, signature) {
  if (application.status !== "assigned") {
    throw new HttpError(400, "Incorrect application status");
  }

  // Check if caller is applicant
  if (application.address !== address) {
    throw new HttpError(403, "Only the owner is allow to accept the work");
  }

  await Application.updateOne({ _id: application._id }, { status: "started" });

  await ApplicationTimeline.create({
    bountyIndexer: application.bountyIndexer,
    applicantAddress: application.address,
    action,
    data,
    address,
    signature,
  });
}

async function assignApplication(
  application,
  action,
  data,
  address,
  signature,
) {
  if (application.status !== "apply") {
    throw new HttpError(400, "Incorrect application status");
  }

  const childBounty = await ChildBounty.findOne({
    network: application.bountyIndexer.network,
    parentBountyIndex: application.bountyIndexer.bountyIndex,
    index: application.bountyIndexer.childBountyIndex,
  });
  if (!childBounty) {
    throw new HttpError(500, "Related bounty not found");
  }

  // Check if caller is bounty curator
  if (!childBounty.childBounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator is allow to assign the work");
  }

  await Application.updateOne({ _id: application._id }, { status: "assigned" });

  await ApplicationTimeline.create({
    bountyIndexer: application.bountyIndexer,
    applicantAddress: application.address,
    action,
    data,
    address,
    signature,
  });
}

async function unassignApplication(
  application,
  action,
  data,
  address,
  signature,
) {
  if (!["assigned", "started"].includes(application.status)) {
    throw new HttpError(400, "Incorrect application status");
  }

  const childBounty = await ChildBounty.findOne({
    network: application.bountyIndexer.network,
    parentBountyIndex: application.bountyIndexer.bountyIndex,
    index: application.bountyIndexer.childBountyIndex,
  });
  if (!childBounty) {
    throw new HttpError(500, "Related bounty not found");
  }

  // Check if caller is bounty curator
  if (!childBounty.childBounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator is allow to unassign the work");
  }

  await Application.updateOne({ _id: application._id }, { status: "apply" });

  await ApplicationTimeline.create({
    bountyIndexer: application.bountyIndexer,
    applicantAddress: application.address,
    action,
    data,
    address,
    signature,
  });
}

module.exports = {
  apply,
  updateApplication,
};
