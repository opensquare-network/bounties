const mongoose = require("mongoose");

const ApplicationTimelineSchema = new mongoose.Schema(
  {
    bountyIndexer: {
      network: String,
      parentBountyIndex: Number,
      index: Number,
    },
    applicantAddress: String,
    action: String,
    data: mongoose.Schema.Types.Mixed,
    address: String,
    signature: String,
    pinHash: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
  },
);

ApplicationTimelineSchema.index({
  "bountyIndexer.network": 1,
  "bountyIndexer.parentBountyIndex": 1,
  "bountyIndexer.index": 1,
  address: 1,
});

ApplicationTimelineSchema.virtual("childBounty", {
  ref: "ChildBounty",
  localField: "bountyIndexer.index",
  foreignField: "index",
  match: (application) => ({
    network: application.bountyIndexer.network,
    parentBountyIndex: application.bountyIndexer.parentBountyIndex,
  }),
  justOne: true,
});

const ApplicationTimeline = mongoose.model(
  "ApplicationTimeline",
  ApplicationTimelineSchema,
);

module.exports = { ApplicationTimelineSchema, ApplicationTimeline };
