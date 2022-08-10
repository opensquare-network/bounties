const mongoose = require("mongoose");
const { MONGODB_URI } = require("../env");
const { Bounty } = require("./bounty");
const { ChildBounty } = require("./child-bounty");
const { ChildBountyTimeline } = require("./child-bounty-timeline");
const { Application } = require("./application");
const { ApplicationTimeline } = require("./application-timeline");
const { BountyComment } = require("./bounty-comment");
const { ChildBountyComment } = require("./child-bounty-comment");
const { NotificationEvent, Notification } = require("./notification");

mongoose.connect(MONGODB_URI);
mongoose.connection.on("error", () => {
  console.log(
    "Mongo DB connection error. Please make sure MongoDB is running.",
  );
  process.exit();
});

module.exports = {
  Bounty,
  ChildBounty,
  ChildBountyTimeline,
  Application,
  ApplicationTimeline,
  BountyComment,
  ChildBountyComment,
  Notification,
  NotificationEvent,
};
