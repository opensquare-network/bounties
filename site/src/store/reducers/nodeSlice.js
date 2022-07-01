import { createSlice } from "@reduxjs/toolkit";

import {
  DEFAULT_POLKADOT_NODE_URL,
  DEFAULT_POLKADOT_NODES,
  DEFAULT_KUSAMA_NODE_URL,
  DEFAULT_KUSAMA_NODES,
  DEFAULT_WESTEND_NODES,
  DEFAULT_WESTEND_NODE_URL,
} from "utils/constants";

let nodeUrl = (() => {
  let localNodeUrl = null;
  try {
    localNodeUrl = JSON.parse(localStorage.getItem("nodeUrl"));
  } catch (e) {
    // ignore parse error
  }

  return {
    polkadot:
      DEFAULT_POLKADOT_NODES.find((item) => item.url === localNodeUrl?.polkadot)
        ?.url || DEFAULT_POLKADOT_NODE_URL,
    kusama:
      DEFAULT_KUSAMA_NODES.find((item) => item.url === localNodeUrl?.kusama)
        ?.url || DEFAULT_KUSAMA_NODE_URL,
    westend:
      DEFAULT_WESTEND_NODES.find((item) => item.url === localNodeUrl?.bifrost)
        ?.url || DEFAULT_WESTEND_NODE_URL,
  };
})();

export const defaultNodes = {
  polkadot: DEFAULT_POLKADOT_NODES,
  kusama: DEFAULT_KUSAMA_NODES,
  westend: DEFAULT_WESTEND_NODES,
};

const nodeSlice = createSlice({
  name: "node",
  initialState: {
    currentNode: nodeUrl,
    nodes: defaultNodes,
  },
  reducers: {
    setCurrentNode(state, { payload }) {
      const { chain, url } = payload;
      const beforeUrl = state.currentNode;

      const afterUrl = {
        ...beforeUrl,
        [chain]: url,
      };

      state.currentNode = afterUrl;
      localStorage.setItem("nodeUrl", afterUrl);

      // Mark the node to be updated on connection speed
      if (state.nodes?.[chain]) {
        state.nodes[chain] = (state.nodes[chain] || []).map((item) => {
          if (item.url === beforeUrl[chain]) {
            return { ...item, update: true };
          } else {
            return item;
          }
        });
      }
    },
    setNodesDelay(state, { payload }) {
      (payload || []).forEach((item) => {
        const node = (state.nodes[item.chain] || []).find(
          (node) => item.url === node.url
        );
        if (node) node.delay = item.delay;
      });
    },
  },
});

export const currentNodeSelector = (state) => state.node?.currentNode;
export const nodesSelector = (state) => state.node?.nodes;

export const chainNodesSelector = (chain) => (state) =>
  state.node?.nodes[chain];
export const activeChainNodeSelector = (chain) => (state) =>
  state.node?.currentNode[chain];

export const { setCurrentNode, setNodesDelay, setNodeBlockHeight } =
  nodeSlice.actions;

export default nodeSlice.reducer;
