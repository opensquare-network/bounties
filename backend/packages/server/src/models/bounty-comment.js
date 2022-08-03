const mongoose = require("mongoose");

const BountyCommentSchema = new mongoose.Schema(
  {
    bountyIndexer: {
      network: String,
      bountyIndex: Number,
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

BountyCommentSchema.virtual("bounty", {
  ref: "Bounty",
  localField: "bountyIndexer.bountyIndex",
  foreignField: "bountyIndex",
  match: (comment) => ({
    network: comment.bountyIndexer.network,
  }),
  justOne: true,
});

const BountyComment = mongoose.model("BountyComment", BountyCommentSchema);

module.exports = { BountyCommentSchema, BountyComment };
