export function resolveBountyDetailRoute(network = "", parentIndex = "") {
  return `/network/${network}/bounty/${parentIndex}`;
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

export function resolveImportChildBountyRoute(network, parentIndex) {
  return `/import_child_bounty?network=${network}&parentBountyId=${parentIndex}`;
}
