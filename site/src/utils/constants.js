import { Chains } from "@osn/constants";

const DEVELOPMENT_NETWORK = [
  { network: Chains.polkadot },
  { network: Chains.kusama },
];

const PRODUCTION_NETWORK = [
  { network: Chains.polkadot },
  { network: Chains.kusama },
];

export const AVAILABLE_NETWORKS = [];

if (process.env.REACT_APP_ENVIRONMENT === "development") {
  AVAILABLE_NETWORKS.push(...DEVELOPMENT_NETWORK);
} else if (process.env.REACT_APP_ENVIRONMENT === "production") {
  AVAILABLE_NETWORKS.push(...PRODUCTION_NETWORK);
}

export const ASSETS = [
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    decimals: 10,
  },
  {
    id: "kusama",
    name: "Kusama",
    symbol: "KSM",
    decimals: 12,
  },
];

export const TEST_ASSETS = [
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    decimals: 10,
  },
  {
    id: "kusama",
    name: "Kusama",
    symbol: "KSM",
    decimals: 12,
  },
];

export const DEFAULT_POLKADOT_NODES = [
  {
    name: "Parity",
    url: "wss://rpc.polkadot.io",
  },
  {
    name: "OnFinality",
    url: "wss://polkadot.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://polkadot-rpc.dwellir.com",
  },
];
export const DEFAULT_POLKADOT_NODE_URL = DEFAULT_POLKADOT_NODES[0]?.url;

export const DEFAULT_KUSAMA_NODES = [
  {
    name: "Parity",
    url: "wss://kusama-rpc.polkadot.io",
  },
  {
    name: "OnFinality",
    url: "wss://kusama.api.onfinality.io/public-ws",
  },
  {
    name: "Patract",
    url: "wss://pub.elara.patract.io/kusama",
  },
];
export const DEFAULT_KUSAMA_NODE_URL = DEFAULT_KUSAMA_NODES[0]?.url;

export const DEFAULT_NODES = {
  polkadot: DEFAULT_POLKADOT_NODE_URL,
  kusama: DEFAULT_KUSAMA_NODE_URL,
};

export const EmptyList = {
  items: [],
  page: 1,
  pageSize: 10,
  total: 0,
};

export const PROJECT_NAME = "OpenSquare-Bounties";
