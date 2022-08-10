const { HttpError } = require("../utils/exc");
const { Bounty, BountyComment } = require("../models");
const chainService = require("./chain.service");
const { ipfsAddBuffer } = require("./ipfs.service");
const { BountyStatus, ChildBountyStatus } = require("../utils/constants");

async function getBounties(page, pageSize) {
  const q = {
    status: {
      $ne: BountyStatus.Closed
    }
  };
  const total = await Bounty.countDocuments(q);
  const items = await Bounty.find(q)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate("childBountiesCount");
  return {
    items,
    total,
    page,
    pageSize,
  };
}

async function getBounty(network, bountyIndex) {
  const bounty = await Bounty.findOne({ network, bountyIndex }).populate({
    path: "childBounties",
    select:
      "network parentBountyIndex index title status childBounty createdAt updatedAt",
  });

  if (!bounty) {
    throw new HttpError(404, "Bounty not found");
  }

  const bountyData = bounty.toJSON();

  const getSort = (childBounty) => {
    switch (childBounty.status) {
      case ChildBountyStatus.Open: {
        return 1;
      }
      case ChildBountyStatus.Assigned: {
        return 2;
      }
      case ChildBountyStatus.Awarded: {
        return 3;
      }
      case ChildBountyStatus.Closed: {
        return 4;
      }
      default: {
        return 5;
      }
    }
  };
  bountyData.childBounties.sort((a, b) => {
    return getSort(a) - getSort(b);
  });

  return bountyData;
}

async function pinFile(file) {
  const fileData = file.buffer;
  const Megabyte = 1024 * 1024;
  if (file.size > 10 * Megabyte) {
    throw new HttpError(
      400,
      "The upload file has exceeded the size limitation",
    );
  }

  const result = await ipfsAddBuffer(fileData);
  const cid = result.path;
  return cid;
}

async function importBounty(
  network,
  bountyIndex,
  logo,
  title,
  content,
  data,
  address,
  signature,
) {
  const exists = await Bounty.exists({ network, bountyIndex });
  if (exists) {
    throw new HttpError(400, "Bounty is already imported");
  }

  const bounty = await chainService.getBounty(network, bountyIndex);
  if (!bounty) {
    throw new HttpError(404, `Can not find bounty ${bountyIndex} on chain`);
  }

  if (!bounty.meta?.status?.active) {
    throw new HttpError(404, `Can import active bounty only`);
  }

  if (bounty.curators.length === 0) {
    throw new HttpError(403, "Can not find bounty curator");
  }

  if (!bounty.curators.includes(address)) {
    throw new HttpError(403, "Only curator is allowed to import the bounty");
  }

  let logoCid;
  if (logo) {
    logoCid = await pinFile(logo);
  }

  return await Bounty.create({
    network,
    bountyIndex,
    logo: logoCid,
    title,
    content,
    bounty,
    data,
    address,
    signature,
    status: BountyStatus.Open,
  });
}

async function updateBounty(
  action,
  network,
  bountyIndex,
  data,
  address,
  signature,
) {
  const bounty = await Bounty.findOne({
    network,
    bountyIndex,
  });
  if (!bounty) {
    throw new HttpError(500, "Bounty not found");
  }

  let updatedBounty;
  if (action === "closeBounty") {
    updatedBounty = await closeBounty(bounty, action, data, address, signature);
  } else if (action === "reopenBounty") {
    updatedBounty = await reopenBounty(
      bounty,
      action,
      data,
      address,
      signature,
    );
  } else {
    throw new HttpError(400, `Unknown action: ${action}`);
  }

  return updatedBounty;
}

async function closeBounty(bounty, action, data, address, signature) {
  if (![BountyStatus.Open].includes(bounty.status)) {
    throw new HttpError(400, 'Can close bounty on "open" status only');
  }

  // Check if caller is bounty curator
  if (!bounty.bounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator can close");
  }

  const updatedBounty = await Bounty.findOneAndUpdate(
    { _id: bounty._id },
    { status: BountyStatus.Closed },
    { new: true },
  );

  return updatedBounty;
}

async function reopenBounty(bounty, action, data, address, signature) {
  if (![BountyStatus.Closed].includes(bounty.status)) {
    throw new HttpError(400, 'Can reopen bounty on "closed" status only');
  }

  // Check bounty on-chain status
  const onchainBounty = await chainService.getBounty(bounty.network, bounty.bountyIndex);
  if (!onchainBounty) {
    throw new HttpError(404, `Can not find bounty ${bountyIndex} on chain`);
  }

  if (!onchainBounty.meta?.status?.active) {
    throw new HttpError(400, `Can reopen active bounty only`);
  }

  // Check if caller is bounty curator
  if (!bounty.bounty.curators.includes(address)) {
    throw new HttpError(403, "Only the curator can reopen");
  }

  const updatedBounty = await Bounty.findOneAndUpdate(
    { _id: bounty._id },
    { status: BountyStatus.Open },
    { new: true },
  );

  return updatedBounty;
}

async function getBountyComments(network, bountyIndex, page, pageSize) {
  const q = {
    "bountyIndexer.network": network,
    "bountyIndexer.bountyIndex": bountyIndex,
  };

  const total = await BountyComment.count(q);
  const comments = await BountyComment.find(q)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  return {
    items: comments,
    page,
    pageSize,
    total,
  };
}

module.exports = {
  importBounty,
  updateBounty,
  getBounties,
  getBounty,
  getBountyComments,
};
