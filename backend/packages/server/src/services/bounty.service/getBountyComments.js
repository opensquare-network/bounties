const { BountyComment } = require("../../models");

async function getBountyComments(network, bountyIndex, page, pageSize) {
  const q = {
    "bountyIndexer.network": network,
    "bountyIndexer.bountyIndex": bountyIndex,
  };

  const total = await BountyComment.count(q);
  const comments = await BountyComment.find(q)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  return {
    items: comments,
    page,
    pageSize,
    total,
  };
}

module.exports = {
  getBountyComments,
};
