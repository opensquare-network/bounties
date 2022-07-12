const Router = require("koa-router");

const router = new Router();

const featureRouters = [
  require("./features/bounties/routes"),
  require("./features/comments/routes"),
  require("./features/chain/routes"),
];

for (const r of featureRouters) {
  router.use(r.routes()).use(r.allowedMethods({ throw: true }));
}

module.exports = router;
