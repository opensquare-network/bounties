const mongoose = require("mongoose");

const BountySchema = new mongoose.Schema(
  {
    network: String,
    bountyIndex: Number,
    title: String,
    content: String,
    contentType: String,
    logo: String,
    links: [String],
    status: {
      type: String,
      enum: ["open", "working", "closed"] //TODO: check enums
    },
    bounty: {
      value: Number,
      decimals: Number,
      symbol: String,
      curator: String,
      description: String,
      meta: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const Bounty = mongoose.model("Bounty", BountySchema);

module.exports = { BountySchema, Bounty };
