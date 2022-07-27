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

  //TODO: applicantNetwork?
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
    throw new HttpError(400, "Application not found");
  }

  if (action === "cancelApplication") {
    await cancelApplication(application, action, data, address, signature);
  } else if (action === "assignApplication") {
    await assignApplication(application, action, data, address, signature);
  } else if (action === "acceptAssignment") {
    await acceptAssignment(application, action, data, address, signature);
  } else if (action === "submitWork") {
    await submitWork(application, action, data, address, signature);
  }

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

  console.log(application.bountyIndexer);
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

module.exports = {
  apply,
  updateApplication,
};
