const NODE_API_ENDPOINT =
  process.env.NODE_API_ENDPOINT || "http://localhost:3223";

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "";
const INFURA_PROJECT_SECRET = process.env.INFURA_PROJECT_SECRET || "";
const LOCAL_IPFS_NODE_URL =
  process.env.LOCAL_IPFS_NODE_URL || "https://ipfs.dotask.cc";

const USE_LOCAL_IPFS_NODE = ["true", "True", "TRUE", "1"].includes(
  process.env.USE_LOCAL_IPFS_NODE
);

const MONGODB_URI = process.env.MONGODB_URI;

const MULTISIG_API_ENDPOINT =
  process.env.MULTISIG_API_ENDPOINT || "http://localhost:4701";

module.exports = {
  NODE_API_ENDPOINT,
  INFURA_PROJECT_ID,
  INFURA_PROJECT_SECRET,
  LOCAL_IPFS_NODE_URL,
  USE_LOCAL_IPFS_NODE,
  MONGODB_URI,
  MULTISIG_API_ENDPOINT,
};
