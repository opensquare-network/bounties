import { encodeNetworkAddress } from "@osn/common/src";
import { useSelector } from "react-redux";
import { accountSelector } from "store/reducers/accountSlice";

export function useAccount() {
  const account = useSelector(accountSelector);
  const encodedAddress = encodeNetworkAddress(
    account?.address,
    account?.network,
  );

  if (account) {
    return {
      ...account,
      encodedAddress,
    };
  }
}
