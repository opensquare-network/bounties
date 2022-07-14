const { Chains } = require("../constants");

const chainEndpointsMap = {
  [Chains.polkadot]: process.env.DOT_ENDPOINTS,
  [Chains.kusama]: process.env.KSM_ENDPOINTS,
};

// [chain, endpoints]
const endpoints = Object.values(Chains).map((chain) => {
  let endpoints;
  endpoints = (chainEndpointsMap[chain] || "").split(";");

  return {
    chain,
    endpoints,
  };
});

function getEndpoints() {
  return endpoints;
}

module.exports = {
  getEndpoints,
};
