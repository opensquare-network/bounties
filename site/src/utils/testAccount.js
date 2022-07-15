const { encodeAddress } = require("@polkadot/util-crypto");

const testAccounts = (process.env.REACT_APP_TEST_ACCOUNTS || "")
  .split("|")
  .filter((acc) => acc)
  .map((addr) => encodeAddress(addr, 42));

export function isTestAccount(address) {
  return testAccounts.includes(encodeAddress(address, 42));
}
