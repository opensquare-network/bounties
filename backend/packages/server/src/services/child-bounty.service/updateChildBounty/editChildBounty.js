const { HttpError } = require("../../../utils/exc");
const { ChildBounty, ChildBountyTimeline } = require("../../../models");
const { ChildBountyStatus } = require("../../../utils/constants");

async function editChildBounty(childBounty, action, data, address, signature) {
  if (
    ![ChildBountyStatus.Open, ChildBountyStatus.Assigned].includes(
      childBounty.status,
    )
  ) {
    throw new HttpError(
      400,
      'Can edit child bounty on "open" or "assigned" status only',
    );
  }

  // Check if caller is bounty curator
  if (!childBounty.childBounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator can edit");
  }

  const { title, content, skills } = data || {};
  if (!title) {
    throw new HttpError(400, { title: ["Title is missing"] });
  }

  if (!content) {
    throw new HttpError(400, { content: ["Content is missing"] });
  }

  if (
    skills &&
    (!Array.isArray(skills) || skills.some((item) => typeof item !== "string"))
  ) {
    throw new HttpError(400, { skills: ["Skills must be array of string"] });
  }

  const updatedChildBounty = await ChildBounty.findOneAndUpdate(
    { _id: childBounty._id },
    { title, content, skills, data },
    { new: true },
  );

  await ChildBountyTimeline.create({
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

  return updatedChildBounty;
}

module.exports = {
  editChildBounty,
};
