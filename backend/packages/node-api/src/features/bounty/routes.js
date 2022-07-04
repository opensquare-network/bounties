const Router = require("koa-router");
const bountyController = require("./bounty.controller");

const router = new Router();

router.get("/bounty/:bountyIndex", bountyController.getBountyInfo);

module.exports = router;
