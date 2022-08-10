const mongoose = require("mongoose");

const ChildBountyTimelineSchema = new mongoose.Schema(
  {
    bountyIndexer: {
      network: String,
      parentBountyIndex: Number,
      index: Number,
    },
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

ChildBountyTimelineSchema.index({
  "bountyIndexer.network": 1,
  "bountyIndexer.parentBountyIndex": 1,
  "bountyIndexer.index": 1,
});

ChildBountyTimelineSchema.virtual("childBounty", {
  ref: "ChildBounty",
  localField: "bountyIndexer.index",
  foreignField: "index",
  match: (timelineItem) => ({
    network: timelineItem.bountyIndexer.network,
    parentBountyIndex: timelineItem.bountyIndexer.parentBountyIndex,
  }),
  justOne: true,
});

const ChildBountyTimeline = mongoose.model(
  "ChildBountyTimeline",
  ChildBountyTimelineSchema,
);

module.exports = { ChildBountyTimelineSchema, ChildBountyTimeline };
