import { useMemo } from "react";
import { useSelector } from "react-redux";
import { childBountyDetailIsCuratorViewSelector } from "store/reducers/childBountyDetailSlice";
import { BOUNTY_STATUS, CHILD_BOUNTY_STATUS } from "utils/constants";
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
  const { status } = detail ?? {};

  const { isSameNetwork } = useDifferentNetworkNotice(detail?.network);
  const isCurator = useIsCurator(
    // for bounty
    detail?.bounty?.curators ||
      // for child bounty
      detail?.childBounty?.curators,
  );
  const isCuratorView = useSelector(childBountyDetailIsCuratorViewSelector);

  const canEditBounty = useMemo(
    () =>
      ![
        BOUNTY_STATUS.Closed,
        CHILD_BOUNTY_STATUS.Closed,
        CHILD_BOUNTY_STATUS.Awarded,
      ].includes(status) &&
      isSameNetwork &&
      isCurator &&
      isCuratorView,
    [isSameNetwork, isCurator, status, isCuratorView],
  );

  const canComment = useMemo(() => isSameNetwork, [isSameNetwork]);

  const canImportChildBounty = useMemo(
    () =>
      ![
        BOUNTY_STATUS.Closed,
        CHILD_BOUNTY_STATUS.Closed,
        CHILD_BOUNTY_STATUS.Awarded,
      ].includes(status) &&
      isSameNetwork &&
      isCurator &&
      isCuratorView,
    [isSameNetwork, isCurator, status, isCuratorView],
  );

  const canAssignHunter = useMemo(
    () => isSameNetwork && isCurator && isCuratorView,
    [isSameNetwork, isCurator, isCuratorView],
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
