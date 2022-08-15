import { useMemo } from "react";
import { useAccount } from "./useAccount";
import { useDifferentNetworkNotice } from "./useDifferentNetworkNotice";
import { useIsCurator } from "./useIsCurator";

export function usePermission(detail) {
  const { isSameNetwork } = useDifferentNetworkNotice(detail?.network);
  const account = useAccount();
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

  return {
    canEditBounty,
    canComment,
  };
}
