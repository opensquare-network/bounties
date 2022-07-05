const { Schema } = require("mongoose");

const Decimal128 = {
  type: Schema.Types.Decimal128,
  get: (v) => v?.toString(),
};

module.exports = {
  Decimal128,
};
