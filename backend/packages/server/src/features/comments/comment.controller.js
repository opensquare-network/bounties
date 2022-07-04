const { HttpError } = require("../../utils/exc");
const commentService = require("../../services/comment.service");
const { ContentType } = require("../../constants");

async function postComment(ctx) {
  const { data, address, signature } = ctx.request.body;
  const {
    type,
    network,
    bountyIndex,
    childBountyIndex,
    content,
    contentType,
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

  if (
    contentType !== ContentType.Markdown &&
    contentType !== ContentType.Html
  ) {
    throw new HttpError(400, { contentType: ["Unknown content type"] });
  }

  let indexer;
  if (type === "bounty") {
    indexer = {
      type,
      network,
      bountyIndex,
    };
  } else if (type === "childBounty") {
    indexer = {
      type,
      network,
      bountyIndex,
      childBountyIndex,
    };
  } else {
    throw new HttpError(400, { type: ["Type is missing"] });
  }

  ctx.body = await commentService.postComment(
    indexer,
    content,
    contentType,
    commenterNetwork,
    data,
    address,
    signature
  );
}

module.exports = {
  postComment,
};
