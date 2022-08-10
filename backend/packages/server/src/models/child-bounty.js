const mongoose = require("mongoose");
const { ChildBountyStatus } = require("../utils/constants");
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
      enum: Object.values(ChildBountyStatus),
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

ChildBountySchema.virtual("parentBounty", {
  ref: "Bounty",
  localField: "parentBountyIndex",
  foreignField: "bountyIndex",
  match: (childBounty) => ({ network: childBounty.network }),
  justOne: true,
});

ChildBountySchema.virtual("applications", {
  ref: "Application",
  localField: "index",
  foreignField: "bountyIndexer.index",
  match: (childBounty) => ({
    "bountyIndexer.network": childBounty.network,
    "bountyIndexer.parentBountyIndex": childBounty.parentBountyIndex,
  }),
});

const ChildBounty = mongoose.model("ChildBounty", ChildBountySchema);

module.exports = { ChildBountySchema, ChildBounty };
