export function resolveBountyDetailRoute(network = "", idIndex = "") {
  return `/network/${network}/bounty/${idIndex}`;
}

export function resolveChildBountyDetailRoute(
  network = "",
  parentIndex = "",
  childIndex = "",
) {
  return (
    resolveBountyDetailRoute(network, parentIndex) +
    `/child-bounty/${childIndex}`
  );
}
