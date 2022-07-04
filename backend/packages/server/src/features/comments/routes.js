const Router = require("koa-router");
const commentController = require("./comment.controller");
const requireSignature = require("../../middleware/require-signature");

const router = new Router();

router.post("/comments", requireSignature, commentController.postComment);


module.exports = router;
