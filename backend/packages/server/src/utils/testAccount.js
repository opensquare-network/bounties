const { encodeAddress } = require("@polkadot/util-crypto");

const testAccounts = (process.env.TEST_ACCOUNTS || "")
  .split("|")
  .filter((acc) => acc)
  .map((addr) => encodeAddress(addr, 42));

function isTestAccount(address) {
  return testAccounts.includes(encodeAddress(address, 42));
}

module.exports = {
  isTestAccount,
};
