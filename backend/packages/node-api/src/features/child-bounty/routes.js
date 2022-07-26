const Router = require("koa-router");
const childBountyController = require("./child-bounty.controller");

const router = new Router();

router.get(
  "/child-bounty/:parentBountyIndex(\\d+)_:index(\\d+)",
  childBountyController.getChildBountyInfo,
);

module.exports = router;
