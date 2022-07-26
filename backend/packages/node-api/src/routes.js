const Router = require("koa-router");
const { Chains } = require("./constants");

const router = new Router();

const chainFeatureRouters = [
  require("./features/bounty/routes"),
  require("./features/child-bounty/routes"),
];

const commonFeatureRouters = [];

module.exports = (app) => {
  for (const r of commonFeatureRouters) {
    router.use(r.routes(), r.allowedMethods({ throw: true }));
  }

  for (const r of chainFeatureRouters) {
    router.use(
      `/:chain(${Object.keys(Chains).join("|")})`,
      r.routes(),
      r.allowedMethods({ throw: true }),
    );
  }

  app.use(router.routes());
};
