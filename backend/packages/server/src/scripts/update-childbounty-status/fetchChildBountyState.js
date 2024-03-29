async function fetchChildBountyState(network, parentBountyIndex, index) {
  const url = `https://${network}.subsquare.io/api/treasury/child-bounties/${parentBountyIndex}_${index}`;
  console.log(`Fetch from: ${url}`);

  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to fetch child bounty status from subsquare: ${resp.status}`);
  }

  const data = await resp.json();

  const childBounty = data.onchainData;
  const state = childBounty?.state?.state;
  const beneficiary = childBounty?.beneficiary;

  return { beneficiary, state };
}

module.exports = {
  fetchChildBountyState,
};
