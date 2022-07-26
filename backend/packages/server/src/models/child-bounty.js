const mongoose = require("mongoose");
const { Decimal128 } = require("./utils");

const ChildBountySchema = new mongoose.Schema(
  {
    network: String,
    index: Number,
    parentBountyIndex: Number,
    title: String,
    content: String,
    skills: [String],
    data: mongoose.Schema.Types.Mixed,
    pinHash: String,
    address: String,
    signature: String,
    status: {
      type: String,
      enum: ["open", "closed"],
    },
    childBounty: {
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
  },
);

const ChildBounty = mongoose.model("ChildBounty", ChildBountySchema);

module.exports = { ChildBountySchema, ChildBounty };
