const { HttpError } = require("../../utils/exc");
const applicationService = require("../../services/application.service");
const { ApplicationActions } = require("../../utils/constants");

async function apply(ctx) {
  const { data, address, signature } = ctx.request.body;
  const {
    action,
    network,
    parentBountyIndex,
    index,
    description,
    applicantNetwork,
  } = data;

  if (action !== ApplicationActions.ApplyChildBounty) {
    throw new HttpError(400, { action: ["Action must be applyChildBounty"] });
  }

  if (!applicantNetwork) {
    throw new HttpError(400, {
      applicantNetwork: ["Applicant network is missing"],
    });
  }

  if (!description) {
    throw new HttpError(400, {
      description: ["Application description is missing"],
    });
  }

  const bountyIndexer = {
    network,
    parentBountyIndex,
    index,
  };

  ctx.body = await applicationService.apply(
    bountyIndexer,
    description,
    applicantNetwork,
    data,
    address,
    signature,
  );
}

async function updateApplication(ctx) {
  const { data, address, signature } = ctx.request.body;
  const { action, network, parentBountyIndex, index, applicantAddress } = data;

  if (!action) {
    throw new HttpError(400, "Action is missing");
  }

  if (!applicantAddress) {
    throw new HttpError(400, {
      applicantAddress: ["Applicant address is missing"],
    });
  }

  const bountyIndexer = {
    network,
    parentBountyIndex,
    index,
  };

  ctx.body = await applicationService.updateApplication(
    action,
    bountyIndexer,
    applicantAddress,
    data,
    address,
    signature,
  );
}

module.exports = {
  apply,
  updateApplication,
};
