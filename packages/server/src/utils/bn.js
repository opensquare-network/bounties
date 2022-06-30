const BigNumber = require("bignumber.js");

function bnAdd(a, b) {
  return new BigNumber(a).plus(b).toFixed();
}

module.exports = {
  bnAdd,
};
