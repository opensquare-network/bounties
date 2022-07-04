const Router = require("koa-router");
const chainController = require("./chain.controller");

const router = new Router();

router.get("/chain/:network/bounty/:bountyIndex", chainController.getBounty);

module.exports = router;
