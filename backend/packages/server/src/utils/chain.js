const NetworkInfo = {
  polkadot: {
    network: "polkadot",
    symbol: "DOT",
    decimals: 10,
  },
  kusama: {
    network: "kusama",
    symbol: "KSM",
    decimals: 12,
  },
};

const allChains = Object.keys(NetworkInfo);

module.exports = {
  NetworkInfo,
  allChains,
};
