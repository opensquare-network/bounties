const mongoose = require("mongoose");
const { ApplicationStatus } = require("../utils/constants");

const ApplicationSchema = new mongoose.Schema(
  {
    bountyIndexer: {
      network: String,
      parentBountyIndex: Number,
      index: Number,
    },
    description: String,
    data: mongoose.Schema.Types.Mixed,
    pinHash: String,
    address: String,
    signature: String,
    status: {
      type: String,
      enum: [
        ApplicationStatus.Apply,
        ApplicationStatus.Assigned,
        ApplicationStatus.Started,
        ApplicationStatus.Submitted,
        ApplicationStatus.Cancelled,
        ApplicationStatus.WorkDone,
      ],
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
    "bountyIndexer.parentBountyIndex": 1,
    "bountyIndexer.index": 1,
    address: 1,
  },
  { unique: true },
);

const Application = mongoose.model("Application", ApplicationSchema);

module.exports = { ApplicationSchema, Application };
