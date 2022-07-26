const Router = require("koa-router");
const chainController = require("./chain.controller");

const router = new Router();

router.get("/chain/:network/bounty/:bountyIndex", chainController.getBounty);
router.get(
  "/chain/:network/child-bounty/:parentBountyIndex(\\d+)_:index(\\d+)",
  chainController.getChildBounty,
);

module.exports = router;
