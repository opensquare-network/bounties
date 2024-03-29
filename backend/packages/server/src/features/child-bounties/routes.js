const Router = require("koa-router");
const childBountyController = require("./child-bounty.controller");
const requireSignature = require("../../middleware/require-signature");

const router = new Router();

router.get("/child-bounties", childBountyController.getChildBounties);

router.post(
  "/child-bounties",
  requireSignature,
  childBountyController.importChildBounty,
);

router.patch(
  "/child-bounty",
  requireSignature,
  childBountyController.updateChildBounty,
);

router.get(
  "/network/:network/child-bounties/:parentBountyIndex(\\d+)_:index(\\d+)",
  childBountyController.getChildBounty,
);

router.get(
  "/network/:network/child-bounties/:parentBountyIndex(\\d+)_:index(\\d+)/comments",
  childBountyController.getChildBountyComments,
);

router.post(
  "/network/:network/child-bounties/:parentBountyIndex(\\d+)_:index(\\d+)/comments",
  requireSignature,
  childBountyController.postChildBountyComment
);

module.exports = router;
