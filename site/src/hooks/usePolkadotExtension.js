import { useState, useEffect } from "react";
import { useIsMounted } from "@osn/common/src/utils/hooks";
import { isWeb3Injected, web3Enable } from "@polkadot/extension-dapp";
import { PROJECT_NAME } from "../utils/constants";
import { polkadotWeb3Accounts } from "@osn/common/src/extension";

export default function usePolkadotExtension() {
  const isMounted = useIsMounted();
  const [hasExtension, setHasExtension] = useState(false);
  const [detecting, setDetecting] = useState(true);
  const [isPolkadotExtensionAccessible, setIsPolkadotExtensionAccessible] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    (async () => {
      const web3Apps = await web3Enable(PROJECT_NAME);
      setHasExtension(isWeb3Injected);
      if (!isWeb3Injected) {
        setDetecting(false);
        return;
      }

      const accessEnabled = web3Apps?.length > 0;
      if (isMounted.current) {
        setIsPolkadotExtensionAccessible(accessEnabled);
      }

      if (!accessEnabled) {
        if (isMounted.current) {
          setDetecting(false);
        }
        return;
      }

      const extensionAccounts = await polkadotWeb3Accounts();
      if (isMounted) {
        setAccounts(extensionAccounts);
        setDetecting(false);
      }
    })();
  }, [isMounted])

  return {
    accounts,
    hasExtension,
    isPolkadotExtensionAccessible,
    detecting,
  };
}
