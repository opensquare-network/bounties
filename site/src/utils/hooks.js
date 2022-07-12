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

// TODO: move this to common or ui
/**
 * @typedef {{
 * immediate?: boolean
 * onError?: (e: unknown) => void
 * }} useAsyncStateOption
 */
/**
 * @copyright vueuse
 * @param {Promise<any> | ((...args: any[]) => Promise<any>)} promise
 * @param {any} initialState
 * @param {useAsyncStateOption} options
 */
export function useAsyncState(promise, initialState, options) {
  const { immediate = true, onError = () => {} } = options ?? {};

  const [state, setState] = useState(initialState);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const execute = async (...args) => {
    setIsReady(false);
    setIsLoading(true);

    const p = typeof promise === "function" ? promise(...args) : promise;

    try {
      const data = await p;

      setState(data);
      setIsReady(true);
    } catch (e) {
      setError(e);
      onError(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state,
    error,
    isReady,
    isLoading,
    execute,
  };
}
