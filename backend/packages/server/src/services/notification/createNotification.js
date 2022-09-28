const { Notification } = require("../../models");
const { toPublicKey } = require("../../utils/address");

async function createNotification(receiver, type, data) {
  const notificationOwner = toPublicKey(receiver);
  await Notification.create({
    owner: notificationOwner,
    type: Array.isArray(type) ? type : [type],
    read: false,
    data,
  });
}

module.exports = createNotification;
