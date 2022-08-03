const mongoose = require("mongoose");

const ChildBountyCommentSchema = new mongoose.Schema(
  {
    bountyIndexer: {
      network: String,
      parentBountyIndex: Number,
      index: Number,
    },
    commenterNetwork: String,
    content: String,
    data: mongoose.Schema.Types.Mixed,
    address: String,
    signature: String,
    pinHash: String,
  },
  {
    typeKey: "$type",
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

ChildBountyCommentSchema.virtual("childBounty", {
  ref: "ChildBounty",
  localField: "bountyIndexer.index",
  foreignField: "index",
  match: (comment) => ({
    network: comment.bountyIndexer.network,
    parentBountyIndex: comment.bountyIndexer.parentBountyIndex,
  }),
  justOne: true,
});

const ChildBountyComment = mongoose.model(
  "ChildBountyComment",
  ChildBountyCommentSchema,
);

module.exports = { ChildBountyCommentSchema, ChildBountyComment };
