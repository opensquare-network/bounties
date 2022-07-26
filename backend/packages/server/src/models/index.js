const mongoose = require("mongoose");
const { MONGODB_URI } = require("../env");
const { Bounty } = require("./bounty");
const { ChildBounty } = require("./child-bounty");
const { Comment } = require("./comment");

mongoose.connect(MONGODB_URI);
mongoose.connection.on("error", () => {
  console.log(
    "Mongo DB connection error. Please make sure MongoDB is running.",
  );
  process.exit();
});

module.exports = {
  Bounty,
  ChildBounty,
  Comment,
};
