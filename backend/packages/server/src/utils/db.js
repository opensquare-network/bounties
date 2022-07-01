const BigNumber = require("bignumber.js");
const { Types } = require("mongoose");

function toDecimal128(num) {
  return Types.Decimal128.fromString(new BigNumber(num).toString());
}

module.exports = {
  toDecimal128,
};
