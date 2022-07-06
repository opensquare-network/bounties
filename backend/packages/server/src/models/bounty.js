const mongoose = require("mongoose");
const { Decimal128 } = require("./utils");

const BountySchema = new mongoose.Schema(
  {
    network: String,
    bountyIndex: Number,
    title: String,
    content: String,
    logo: String,
    data: mongoose.Schema.Types.Mixed,
    address: String,
    signature: String,
    links: [String],
    status: {
      type: String,
      enum: ["open", "closed"],
    },
    bounty: {
      value: Decimal128,
      decimals: Number,
      symbol: String,
      curators: [String],
      description: String,
      meta: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
  }
);

const Bounty = mongoose.model("Bounty", BountySchema);

module.exports = { BountySchema, Bounty };
