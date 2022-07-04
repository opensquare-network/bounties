const { getApis } = require("@osn/polkadot-api-container");

async function getBountyFromOneApi(api, bountyIndex) {
  const bountyMeta = await api.query.bounties.bounties(bountyIndex);
  const bountyDescription = await api.query.bounties.bountyDescriptions(
    bountyIndex
  );
  const meta = bountyMeta.toJSON();
  const description = bountyDescription.toJSON();

  return {
    meta,
    description,
  };
}

async function getBountyFromApis(apis, bountyIndex) {
  const promises = [];
  for (const api of apis) {
    promises.push(getBountyFromOneApi(api, bountyIndex));
  }

  return Promise.any(promises);
}

async function getBountyInfo(ctx) {
  const { chain, bountyIndex } = ctx.params;
  const apis = getApis(chain);
  if (apis.every((api) => !api.isConnected)) {
    ctx.throw(500, "No apis connected");
    return;
  }

  try {
    const bountyInfo = await getBountyFromApis(apis, parseInt(bountyIndex));
    ctx.body = bountyInfo;
  } catch (e) {
    console.error("Get bounty info from node fail", e);
    if (e.errors.length > 0) {
      ctx.throw(500, e.errors[0].message);
    } else {
      ctx.throw(500, "Failed to get bounty info from node");
    }
  }
}

module.exports = {
  getBountyInfo,
};
