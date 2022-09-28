const { isSamePublicKey } = require("../utils/address");
const { NotificationType } = require("../utils/constants");
const { extractMentions } = require("../utils/mention");

function getCommentNotifications(bountyOwner, comment) {
  const mentions = extractMentions(comment.content);
  const notifications = mentions.map(item => ({ receiver: item.address, type: NotificationType.Mention }));
  if (!isSamePublicKey(bountyOwner, comment.address)) {
    const item = notifications.find(item => item.receiver === bountyOwner);
    if (item) {
      item.type = [NotificationType.Reply, NotificationType.Mention];
    } else {
      notifications.push({ receiver: bountyOwner, type: NotificationType.Reply });
    }
  }

  return notifications;
}

module.exports = {
  getCommentNotifications,
};
