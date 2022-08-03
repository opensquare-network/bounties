const { Notification } = require("../../models");
const { toPublicKey } = require("../../utils/address");

async function getNotifications(network, address, page, pageSize) {
  const publicKey = toPublicKey(address);
  const q = { owner: publicKey };
  const total = await Notification.countDocuments(q);
  const notifications = await Notification.find(q)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate({
      path: "data.applicationTimelineItem",
      populate: "childBounty",
    })
    .populate({
      path: "data.bountyComment",
      populate: "bounty",
    })
    .populate({
      path: "data.childBountyComment",
      populate: "childBounty",
    });

  return {
    items: notifications,
    page,
    pageSize,
    total,
  };
}

module.exports = getNotifications;
