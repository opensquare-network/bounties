const { HttpError } = require("../../utils/exc");
const { ipfsAddBuffer } = require("../ipfs.service");

async function pinFile(file) {
  const fileData = file.buffer;
  const Megabyte = 1024 * 1024;
  if (file.size > 10 * Megabyte) {
    throw new HttpError(
      400,
      "The upload file has exceeded the size limitation",
    );
  }

  const result = await ipfsAddBuffer(fileData);
  const cid = result.path;
  return cid;
}

module.exports = {
  pinFile,
};
