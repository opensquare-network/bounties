import { useMemo } from "react";
import { useDifferentNetworkNotice } from "./useDifferentNetworkNotice";
import { useIsCurator } from "./useIsCurator";

/**
 * @typedef {{
 *  network: string
 *  [k: string]: any
 * }} Detail
 */

/**
 * @param {Detail} detail
 * @description given a bounty detail, can be `bountyDetail` or `childBountyDetail`, return current account permissions
 */
export function useBountyPermission(detail) {
  const { isSameNetwork } = useDifferentNetworkNotice(detail?.network);
  const isCurator = useIsCurator(
    // for bounty
    detail?.bounty?.curators ||
      // for child bounty
      detail?.childBounty?.curators,
  );

  const canEditBounty = useMemo(
    () => isSameNetwork && isCurator,
    [isSameNetwork, isCurator],
  );

  const canComment = useMemo(() => isSameNetwork, [isSameNetwork]);

  const canImportChildBounty = useMemo(
    () => isSameNetwork && isCurator,
    [isSameNetwork, isCurator],
  );

  const canAssignHunter = useMemo(
    () => isSameNetwork && isCurator,
    [isSameNetwork, isCurator],
  );

  return {
    /**
     * for bounty or child bounty
     */
    canEditBounty,

    /**
     * for bounty or child bounty
     */
    canComment,

    /**
     * for bounty
     */
    canImportChildBounty,

    /**
     * for child bounty
     */
    canAssignHunter,
  };
}
