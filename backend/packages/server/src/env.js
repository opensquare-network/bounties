const NODE_API_ENDPOINT =
  process.env.NODE_API_ENDPOINT || "http://localhost:3223";

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "";
const INFURA_PROJECT_SECRET = process.env.INFURA_PROJECT_SECRET || "";
const LOCAL_IPFS_NODE_URL =
  process.env.LOCAL_IPFS_NODE_URL || "http://ipfs.dotask.cc:5001";

const USE_LOCAL_IPFS_NODE = ["true", "True", "TRUE", "1"].includes(
  process.env.USE_LOCAL_IPFS_NODE
);

module.exports = {
  NODE_API_ENDPOINT,
  INFURA_PROJECT_ID,
  INFURA_PROJECT_SECRET,
  LOCAL_IPFS_NODE_URL,
  USE_LOCAL_IPFS_NODE,
};
