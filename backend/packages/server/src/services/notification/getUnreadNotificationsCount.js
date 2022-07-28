const { Notification } = require("../../models");
const { toPublicKey } = require("../../utils/address");

async function getUnreadNotificationsCount(network, address) {
  const publicKey = toPublicKey(address);
  const q = {
    owner: publicKey,
    read: false,
  };
  const count = await Notification.countDocuments(q);
  return {
    count,
  };
}

module.exports = getUnreadNotificationsCount;
