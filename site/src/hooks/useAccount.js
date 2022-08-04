import { useSelector } from "react-redux";
import { accountSelector } from "store/reducers/accountSlice";

export function useAccount() {
  const account = useSelector(accountSelector);

  return account;
}
