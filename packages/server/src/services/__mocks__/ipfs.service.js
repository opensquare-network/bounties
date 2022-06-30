const { CID } = require("multiformats/cid");
const { cidOf } = jest.requireActual("../ipfs.service");

async function ipfsAdd(data) {
  const c = await cidOf(data);
  return {
    cid: CID.parse(c),
  };
}

module.exports = {
  ipfsAdd,
  cidOf,
};
