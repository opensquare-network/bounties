const multer = require("@koa/multer");
const Router = require("koa-router");
const bountyController = require("./bounty.controller");
const requireSignature = require("../../middleware/require-signature");

const router = new Router();
const upload = multer();

router.get("/bounties", bountyController.getBounties);

router.post(
  "/bounties",
  upload.single("logo"),
  requireSignature,
  bountyController.importBounty,
);

router.patch(
  "/bounty",
  upload.single("logo"),
  requireSignature,
  bountyController.updateBounty,
);

router.get(
  "/network/:network/bounties/:bountyIndex",
  bountyController.getBounty,
);

router.get(
  "/network/:network/bounties/:bountyIndex/comments",
  bountyController.getBountyComments,
);

router.post(
  "/network/:network/bounties/:bountyIndex/comments",
  requireSignature,
  bountyController.postBountyComment
);

module.exports = router;
