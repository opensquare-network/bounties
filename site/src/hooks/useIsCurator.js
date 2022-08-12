import { useMemo } from "react";
import { useAccount } from "./useAccount";

/**
 * @description Given a curator list to assert current account is curator
 */
export function useIsCurator(curators = []) {
  const account = useAccount();

  const isCurator = useMemo(
    () => curators.includes(account?.encodedAddress),
    [account?.encodedAddress],
  );

  return isCurator;
}
