const mongoose = require("mongoose");

const ApplicationTimelineSchema = new mongoose.Schema(
  {
    bountyIndexer: {
      network: String,
      bountyIndex: Number,
      childBountyIndex: Number,
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
  "bountyIndexer.bountyIndex": 1,
  "bountyIndexer.childBountyIndex": 1,
  address: 1,
});

ApplicationTimelineSchema.virtual("childBounty", {
  ref: "ChildBounty",
  localField: "bountyIndexer.childBountyIndex",
  foreignField: "index",
  match: (application) => ({
    network: application.bountyIndexer.network,
    bountyIndex: application.bountyIndexer.parentBountyIndex,
  }),
  justOne: true,
});

const ApplicationTimeline = mongoose.model(
  "ApplicationTimeline",
  ApplicationTimelineSchema,
);

module.exports = { ApplicationTimelineSchema, ApplicationTimeline };
