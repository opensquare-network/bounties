const { ChildBountyComment } = require("../../models");

async function getChildBountyComments(
  network,
  parentBountyIndex,
  index,
  page,
  pageSize,
) {
  const q = {
    "bountyIndexer.network": network,
    "bountyIndexer.parentBountyIndex": parentBountyIndex,
    "bountyIndexer.index": index,
  };

  const total = await ChildBountyComment.count(q);
  const comments = await ChildBountyComment.find(q)
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
  getChildBountyComments,
};
