const { HttpError } = require("../utils/exc");
const { isValidSignature } = require("../utils/signature");

async function verifySignature(msg, address, signature) {
  if (!signature) {
    throw new HttpError(400, "Signature is missing");
  }

  if (!address) {
    throw new HttpError(400, "Address is missing");
  }

  return isValidSignature(msg, signature, address);
}

async function requireSignature(ctx, next) {
  const { data, address, signature } = ctx.request.body;

  if (!data) {
    throw new HttpError(400, "Data is missing");
  }

  if (!signature) {
    throw new HttpError(400, "Signature is missing");
  }

  let msg = data;
  if (typeof data !== "string") {
    msg = JSON.stringify(data);
  }

  const verified = await verifySignature(msg, address, signature);
  if (!verified) {
    throw new HttpError(400, "Signature is invalid");
  }

  await next();
}

module.exports = requireSignature;
