const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    indexer: {
      type: String,
      network: String,
      bountyIndex: Number,
      childBountyIndex: Number,
    },
    content: String,
    contentType: String,
    cid: String,
    pinned: Boolean,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = { CommentSchema, Comment };
