import { encodeNetworkAddress } from "@osn/common";
import { useSelector } from "react-redux";
import { accountSelector } from "@/store/reducers/accountSlice";

export function useAccount() {
  const account = useSelector(accountSelector);

  if (account) {
    const encodedAddress = encodeNetworkAddress(
      account?.address,
      account?.network,
    );

    return {
      ...account,
      encodedAddress,
    };
  }
}
