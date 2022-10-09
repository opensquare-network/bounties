import { isSamePublicKey } from "@osn/common";
import { useMemo } from "react";
import { useAccount } from "./useAccount";

/**
 * @description Given a curator list to assert current account is curator
 */
export function useIsCurator(curators = []) {
  const account = useAccount();

  const isCurator = useMemo(
    () => account?.address && curators.some(curator => isSamePublicKey(curator, account?.address)),
    [curators, account?.address],
  );

  return isCurator;
}
