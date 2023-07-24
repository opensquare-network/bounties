async function fetchBountyState(network, bountyIndex) {
  const url = `https://${network}.subsquare.io/api/treasury/bounties/${bountyIndex}`;
  console.log(`Fetch from: ${url}`);

  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to fetch bounty status from subsquare: ${resp.status}`);
  }

  const data = await resp.json();

  const bounty = data.onchainData;
  const state = bounty?.state?.state;

  return { state };
}

module.exports = {
  fetchBountyState,
};
