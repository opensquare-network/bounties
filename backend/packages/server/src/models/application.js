const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    bountyIndexer: {
      network: String,
      bountyIndex: Number,
      childBountyIndex: Number,
    },
    description: String,
    data: mongoose.Schema.Types.Mixed,
    pinHash: String,
    address: String,
    signature: String,
    status: {
      type: String,
      enum: ["apply", "assigned", "started", "done"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
  },
);

ApplicationSchema.index(
  {
    "bountyIndexer.network": 1,
    "bountyIndexer.bountyIndex": 1,
    "bountyIndexer.childBountyIndex": 1,
    address: 1,
  },
  { unique: true },
);

const Application = mongoose.model("Application", ApplicationSchema);

module.exports = { ApplicationSchema, Application };
