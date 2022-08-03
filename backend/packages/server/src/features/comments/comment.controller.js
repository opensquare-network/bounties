const { HttpError } = require("../../utils/exc");
const bountyCommentService = require("../../services/bounty-comment.service");
const childBountyCommentService = require("../../services/child-bounty-comment.service");

async function postComment(ctx) {
  const { data, address, signature } = ctx.request.body;
  const {
    action,
    type,
    network,
    bountyIndex,
    parentBountyIndex,
    index,
    content,
    commenterNetwork,
  } = data;

  if (action !== "comment") {
    throw new HttpError(400, { action: ["Action must be comment"] });
  }

  if (!commenterNetwork) {
    throw new HttpError(400, {
      commenterNetwork: ["Commenter network is missing"],
    });
  }

  if (!content) {
    throw new HttpError(400, { content: ["Comment content is missing"] });
  }

  if (type === "bounty") {
    ctx.body = await bountyCommentService.postBountyComment(
      network,
      bountyIndex,
      content,
      commenterNetwork,
      data,
      address,
      signature,
    );
  } else if (type === "childBounty") {
    ctx.body = await childBountyCommentService.postChildBountyComment(
      network,
      parentBountyIndex,
      index,
      content,
      commenterNetwork,
      data,
      address,
      signature,
    );
  } else {
    throw new HttpError(400, { type: ["Type is missing"] });
  }
}

module.exports = {
  postComment,
};
