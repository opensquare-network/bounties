const { extractPage } = require("../../utils/pagination");
const notificationService = require("../../services/notification");

async function getNotifications(ctx) {
  const { network, address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);

  const result = await notificationService.getNotifications(
    network,
    address,
    page,
    pageSize
  );

  ctx.body = result;
}

async function getUnreadNotificationsCount(ctx) {
  const { network, address } = ctx.params;

  const result = await notificationService.getUnreadNotificationsCount(
    network,
    address
  );

  ctx.body = result;
}

async function clearUnreadNotifications(ctx) {
  const { network, address } = ctx.params;
  const { items } = ctx.request.body;

  const result = await notificationService.clearUnreadNotifications(
    network,
    address,
    items
  );

  ctx.body = result;
}

module.exports = {
  getNotifications,
  getUnreadNotificationsCount,
  clearUnreadNotifications,
};
