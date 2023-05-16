import { PROJECT_NAME, AVAILABLE_NETWORKS } from "utils/constants";
import CW, {
  ConnectWalletModal as CWM,
  ConnectWalletButton,
} from "@osn/common-ui/es/ConnectWallet";
import { useDispatch } from "react-redux";
import { setAccount } from "../store/reducers/accountSlice";

export { ConnectWalletButton };

/**
 * @param {import("@osn/common-ui/es/ConnectWallet/types").ConnectWalletModalProps} props
 * @description Wrap the ConnectWallet component with `projectName`, `availableNetworks` and `onConnect`
 */
export default function ConnectWallet(props) {
  const dispatch = useDispatch();

  return (
    <CW
      projectName={PROJECT_NAME}
      availableNetworks={AVAILABLE_NETWORKS}
      onConnect={(account) => dispatch(setAccount(account))}
      {...props}
    />
  );
}

/**
 * @param {import("@osn/common-ui/es/ConnectWallet/types").ConnectWalletModalProps} props
 * @description Wrap the ConnectWalletModal component with `projectName`, `availableNetworks` and `onConnect`
 */
export function ConnectWalletModal(props) {
  const dispatch = useDispatch();

  return (
    <CWM
      projectName={PROJECT_NAME}
      availableNetworks={AVAILABLE_NETWORKS}
      onConnect={(account) => dispatch(setAccount(account))}
      {...props}
    />
  );
}
