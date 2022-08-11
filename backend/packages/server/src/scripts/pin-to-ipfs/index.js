const dotenv = require("dotenv");
dotenv.config();

const { startPinBounties } = require("./startPinBounties");
const { startPinBountyComments } = require("./startPinBountyComments");
const { startPinChildBounties } = require("./startPinChildBounties");
const { startPinChildBountyComments } = require("./startPinChildBountyComments");

async function startPin() {
  return Promise.all([
    startPinBounties(),
    startPinChildBounties(),
    startPinBountyComments(),
    startPinChildBountyComments(),
  ]);
}

async function main() {
  try {
    await startPin();
    console.log(`Last pin at:`, new Date());
  } catch (e) {
    console.error(e);
  }
}

main().finally(() => process.exit());
