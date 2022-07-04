const { HttpError } = require("../../utils/exc");
const commentService = require("../../services/comment.service");
const { ContentType } = require("../../constants");

async function postComment(ctx) {
  const { data, address, signature } = ctx.request.body;
  const { type, network, bountyIndex, childBountyIndex, content, contentType } = data;

  if (!content) {
    throw new HttpError(400, { content: ["Comment content is missing"] });
  }

  if (
    contentType !== ContentType.Markdown &&
    contentType !== ContentType.Html
  ) {
    throw new HttpError(400, { contentType: ["Unknown content type"] });
  }

  const indexer = {
    type,
    network,
    bountyIndex,
    childBountyIndex,
  };

  ctx.body = await commentService.postComment(
    indexer,
    content,
    contentType,
    data,
    address,
    signature
  );
}

module.exports = {
  postComment,
};
