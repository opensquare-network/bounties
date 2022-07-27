const { HttpError } = require("../../utils/exc");
const applicationService = require("../../services/application.service");

async function apply(ctx) {
  const { data, address, signature } = ctx.request.body;
  const {
    network,
    bountyIndex,
    childBountyIndex,
    description,
    applicantNetwork,
  } = data;

  if (!applicantNetwork) {
    throw new HttpError(400, {
      applicantNetwork: ["Applicant network is missing"],
    });
  }

  if (!description) {
    throw new HttpError(400, { description: ["Application description is missing"] });
  }

  const bountyIndexer = {
    network,
    bountyIndex,
    childBountyIndex,
  };

  ctx.body = await applicationService.apply(
    bountyIndexer,
    description,
    applicantNetwork,
    data,
    address,
    signature
  );
}

module.exports = {
  apply,
};
