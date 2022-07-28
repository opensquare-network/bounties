const Router = require("koa-router");
const applicationController = require("./application.controller");
const requireSignature = require("../../middleware/require-signature");

const router = new Router();
router.post("/applications", requireSignature, applicationController.apply);
router.patch(
  "/application",
  requireSignature,
  applicationController.updateApplication,
);

module.exports = router;
