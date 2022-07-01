import { createSelector, createSlice } from "@reduxjs/toolkit";

import {
  setCookie,
  getCookie,
  clearCookie,
} from "@osn/common/src/utils/cookie";
import { encodeAddress } from "@polkadot/util-crypto";
import { AVAILABLE_NETWORKS } from "@osn/consts";

const accountSlice = createSlice({
  name: "account",
  initialState: {
    account: undefined,
  },
  reducers: {
    setAccount: (state, { payload }) => {
      if (payload) {
        state.account = payload;
      } else {
        state.account = null;
      }
      if (typeof window !== "undefined") {
        setCookie("address", `${payload.network}/${payload.address}`, 7);
      }
    },
  },
});

export const { setAccount } = accountSlice.actions;

export const logout = () => async (dispatch) => {
  if (typeof window !== "undefined") {
    clearCookie();
  }
  dispatch(setAccount(""));
};

export const accountSelector = (state) => {
  if (state.account.account) {
    return state.account.account;
  } else {
    if (typeof window !== "undefined") {
      const data = getCookie("address");
      if (data && data !== "undefined/undefined") {
        const [network, address] = data.split("/");
        const account = {
          address,
          network,
        };
        setAccount(account);
        return account;
      }
    }
    return null;
  }
};

export const loginNetworkSelector = createSelector(
  accountSelector,
  (account) => {
    return AVAILABLE_NETWORKS.find((item) => item.network === account?.network);
  }
);

export const loginAccountSelector = createSelector(
  loginNetworkSelector,
  accountSelector,
  (network, account) => {
    if (!network) {
      return null;
    }
    return {
      ...network,
      ...account,
    };
  }
);

export const loginAddressSelector = createSelector(
  loginNetworkSelector,
  accountSelector,
  (network, account) => {
    if (!network || !account) {
      return null;
    }
    return encodeAddress(account.address, network.ss58Format);
  }
);

export default accountSlice.reducer;
