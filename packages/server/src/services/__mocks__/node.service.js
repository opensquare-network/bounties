const getApi = async (chain) => {
  console.log(`Use mock getApi`);
  return null;
};

async function getRemark(api, blockHash, extrinsicHash) {
  console.log(`Use mock getRemark`);
  if (
    blockHash ===
    "0x0000000000000000000000000000000000000000000000000000000000000000"
  ) {
    return {
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      blockHeight: 0,
      extrinsicIndex: 0,
      remark:
        "osn:q:1:N:N:1:bafybeidnbaxbd4wvj57nby5vx2d3wwjgcfd2bkbydmqa3p2yw4jcesfwku",
      signer: "5C5C24tLgXg973FRixpzTYTJq9r443LVwjceDvnVErdXgNfn",
      blockTime: 1648444080001,
    };
  } else if (
    blockHash ===
    "0x0000000000000000000000000000000000000000000000000000000000000001"
  ) {
    return {
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000001",
      blockHeight: 1,
      extrinsicIndex: 1,
      blockTime: 1648444080001,
      remark:
        "osn:q:1:A:bafybeidnbaxbd4wvj57nby5vx2d3wwjgcfd2bkbydmqa3p2yw4jcesfwku:bafybeifbp4mtplen3aov5jw52ftv6pigxmniq5yivjh4zaxbuoy6p6fyay",
      signer: "5C5C24tLgXg973FRixpzTYTJq9r443LVwjceDvnVErdXgNfn",
      blockTime: 1648444080001,
    };
  } else if (
    blockHash ===
    "0x0000000000000000000000000000000000000000000000000000000000000002"
  ) {
    return {
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000002",
      blockHeight: 2,
      extrinsicIndex: 2,
      blockTime: 1648444080001,
      remark:
        "osn:q:1:S:N:10:bafybeidnbaxbd4wvj57nby5vx2d3wwjgcfd2bkbydmqa3p2yw4jcesfwku",
      signer: "5C5C24tLgXg973FRixpzTYTJq9r443LVwjceDvnVErdXgNfn",
    };
  } else if (
    blockHash ===
    "0x0000000000000000000000000000000000000000000000000000000000000003"
  ) {
    return {
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000003",
      blockHeight: 3,
      extrinsicIndex: 3,
      blockTime: 1648444080001,
      remark:
        "osn:q:1:F:bafybeid7rubeeu4vyrivdgkpiwgyruvybcriwth7pjn5k5syznpgzegavy",
      signer: "5C7RcsPnPLZNjdZFqPxSMTRVMiHLNafgTUN5h51nGQD8yGa1",
      transfer: {
        tokenIdentifier: "N",
        to: {
          id: "5C5C24tLgXg973FRixpzTYTJq9r443LVwjceDvnVErdXgNfn",
        },
        value: "1",
      },
    };
  } else if (
    blockHash ===
    "0x0000000000000000000000000000000000000000000000000000000000000004"
  ) {
    return {
      remark:
        "osn:q:1:R:bafybeidnbaxbd4wvj57nby5vx2d3wwjgcfd2bkbydmqa3p2yw4jcesfwku",
      signer: "5C5C24tLgXg973FRixpzTYTJq9r443LVwjceDvnVErdXgNfn",
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000004",
      blockHeight: 4,
      extrinsicIndex: 4,
      blockTime: 1648444080001,
    };
  }
}

async function getNativeTokenInfo(api) {
  console.log(`Use mock getNativeTokenInfo`);
  return {
    decimals: 12,
    symbol: "KSM",
  };
}

async function getAssetTokenInfo(api, assetId, blockHash) {
  console.log(`Use mock getAssetTokenInfo`);
  if (assetId === 8) {
    return {
      decimals: 10,
      symbol: "RMRK",
    };
  } else {
    throw new Error(`Unknown assetId: ${assetId}`);
  }
}

module.exports = {
  getApi,
  getRemark,
  getNativeTokenInfo,
  getAssetTokenInfo,
};
