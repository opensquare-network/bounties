const uniqWith = require("lodash.uniqwith");
const { isAddress } = require("@polkadot/util-crypto");

function extractMentions(content) {
  const mentions = [];
  const reMention = /\[@[^\]]+\]\((\w+)-(\w+)\)/g;
  let match;
  while ((match = reMention.exec(content)) !== null) {
    const [, address, network] = match;
    if (!isAddress(address)) {
      continue;
    }
    mentions.push({
      network,
      address,
    });
  }

  return uniqWith(
    mentions,
    (a, b) => a.network === b.network && a.address === b.address,
  );
}

module.exports = {
  extractMentions,
};
