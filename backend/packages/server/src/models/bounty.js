const mongoose = require("mongoose");
const { Decimal128 } = require("./utils");

const IPFS_GATEWAY_URL =
  process.env.IPFS_GATEWAY_URL || "https://ipfs.infura.io/ipfs/";

function getIpfsUrl(logoCid) {
  return `${IPFS_GATEWAY_URL}${logoCid}`;
}

const BountySchema = new mongoose.Schema(
  {
    network: String,
    bountyIndex: Number,
    title: String,
    content: String,
    logo: String,
    data: mongoose.Schema.Types.Mixed,
    pinHash: String,
    address: String,
    signature: String,
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
  },
);

BountySchema.virtual("logoUrl").get(function () {
  return this.logo && getIpfsUrl(this.logo);
});

BountySchema.virtual("childBountiesCount", {
  ref: "ChildBounty",
  localField: "bountyIndex",
  foreignField: "parentBountyIndex",
  match: (bounty) => ({
    network: bounty.network,
    deleted: null,
  }),
  count: true,
});

BountySchema.virtual("childBounties", {
  ref: "ChildBounty",
  localField: "bountyIndex",
  foreignField: "parentBountyIndex",
  match: (bounty) => ({
    network: bounty.network,
    deleted: null,
  }),
});

const Bounty = mongoose.model("Bounty", BountySchema);

module.exports = { BountySchema, Bounty };
