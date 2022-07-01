import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import getApi from "@osn/common/src/services/chain/api";
import { accountSelector } from "../store/reducers/accountSlice";
import { activeChainNodeSelector } from "../store/reducers/nodeSlice";
import { PROJECT_NAME } from "./constants";
import { encodeNetworkAddress } from "@osn/common/src";

export function useApi() {
  const account = useSelector(accountSelector);
  const nodeUrl = useSelector(activeChainNodeSelector(account?.network));
  const [api, setApi] = useState(null);

  useEffect(() => {
    if (!account?.address || !account?.network || !nodeUrl) {
      setApi(null);
      return;
    }

    const abortController = new AbortController();
    const signal = abortController.signal;

    (async (signal) => {
      await web3Enable(PROJECT_NAME);
      const injector = await web3FromAddress(account.address);
      const api = await getApi(account.network, nodeUrl);
      api.setSigner(injector.signer);
      if (signal.aborted) {
        return;
      }
      setApi(api);
    })(signal);
    return () => {
      abortController.abort();
      setApi(null);
    }; //clean up
  }, [account?.address, account?.network, nodeUrl]);

  return api;
}

export const useBalance = (account, api) => {
  const [balance, setBalance] = useState();

  useEffect(() => {
    (async () => {
      setBalance(undefined);
      if (api) {
        const lastHdr = await api.rpc.chain.getHeader();
        const { data: balanceNow } = await api.query.system.account.at(
          lastHdr.hash,
          account.address
        );
        setBalance(balanceNow?.toJSON()?.free);
      }
    })();
  }, [account?.address, account?.network, api]);

  return balance;
};

export const useIsOwner = (ownerAddress, network) => {
  const account = useSelector(accountSelector);
  return (
    account?.address &&
    encodeNetworkAddress(account?.address, network) ===
      encodeNetworkAddress(ownerAddress, network)
  );
};
