const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    bountyIndexer: {
      type: String,
      network: String,
      bountyIndex: Number,
      childBountyIndex: Number,
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
  }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = { CommentSchema, Comment };
