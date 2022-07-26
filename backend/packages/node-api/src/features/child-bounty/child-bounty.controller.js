const { getApis } = require("@osn/polkadot-api-container");

async function getChildBountyFromOneApi(api, parentBountyIndex, index) {
  const childBountyMeta = await api.query.childBounties.childBounties(
    parentBountyIndex,
    index,
  );
  const childBountyDescription =
    await api.query.childBounties.childBountyDescriptions(index);
  const meta = childBountyMeta.toJSON();
  const description = childBountyDescription.toJSON();

  return {
    meta,
    description,
  };
}

async function getChildBountyFromApis(apis, parentBountyIndex, index) {
  const promises = [];
  for (const api of apis) {
    promises.push(getChildBountyFromOneApi(api, parentBountyIndex, index));
  }

  return Promise.any(promises);
}

async function getChildBountyInfo(ctx) {
  const { chain, parentBountyIndex, index } = ctx.params;
  const apis = getApis(chain);
  if (apis.every((api) => !api.isConnected)) {
    ctx.throw(500, "No apis connected");
    return;
  }

  try {
    const childBountyInfo = await getChildBountyFromApis(
      apis,
      parseInt(parentBountyIndex),
      parseInt(index),
    );
    ctx.body = childBountyInfo;
  } catch (e) {
    console.error("Get child bounty info from node fail", e);
    if (e.errors.length > 0) {
      ctx.throw(500, e.errors[0].message);
    } else {
      ctx.throw(500, "Failed to get child bounty info from node");
    }
  }
}

module.exports = {
  getChildBountyInfo,
};
