const Router = require("koa-router");
const bountyController = require("./bounty.controller.js");
const requireSignature = require("../../middleware/require-signature");

const router = new Router();

router.get(
  "/bounties",
  bountyController.getBounties,
);

router.post(
  "/bounties/import",
  requireSignature,
  bountyController.importBounty,
);

router.get(
  "/network/:network/bounties/:bountyIndex",
  bountyController.getBounty,
);

module.exports = router;
