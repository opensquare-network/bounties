const mongoose = require("mongoose");
const EventEmitter = require("events");
const { NotificationType } = require("../utils/constants");

const NotificationSchema = new mongoose.Schema(
  {
    owner: String, // public key of owner address
    type: {
      type: [String],
      enum: [
        NotificationType.Applied,
        NotificationType.Assigned,
        NotificationType.Unassigned,
        NotificationType.Accepted,
        NotificationType.Submitted,
        NotificationType.Cancelled,
      ],
    },
    read: Boolean,
    data: {
      byWho: {
        address: String,
        network: String,
      },
      applicationTimelineItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApplicationTimeline",
      },
    },
  },
  {
    timestamps: true,
  },
);

NotificationSchema.index({ owner: 1, read: 1 });

const eventEmitter = new EventEmitter();

NotificationSchema.post("save", function () {
  eventEmitter.emit("save", this);
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = {
  NotificationEvent: eventEmitter,
  NotificationSchema,
  Notification,
};
