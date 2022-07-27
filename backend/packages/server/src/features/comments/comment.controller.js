const { HttpError } = require("../../utils/exc");
const commentService = require("../../services/comment.service");

async function postComment(ctx) {
  const { data, address, signature } = ctx.request.body;
  const {
    type,
    network,
    bountyIndex,
    childBountyIndex,
    content,
    commenterNetwork,
  } = data;

  if (!commenterNetwork) {
    throw new HttpError(400, {
      commenterNetwork: ["Commenter network is missing"],
    });
  }

  if (!content) {
    throw new HttpError(400, { content: ["Comment content is missing"] });
  }

  let bountyIndexer;
  if (type === "bounty") {
    bountyIndexer = {
      type,
      network,
      bountyIndex,
    };
  } else if (type === "childBounty") {
    bountyIndexer = {
      type,
      network,
      bountyIndex,
      childBountyIndex,
    };
  } else {
    throw new HttpError(400, { type: ["Type is missing"] });
  }

  ctx.body = await commentService.postComment(
    bountyIndexer,
    content,
    commenterNetwork,
    data,
    address,
    signature
  );
}

module.exports = {
  postComment,
};
