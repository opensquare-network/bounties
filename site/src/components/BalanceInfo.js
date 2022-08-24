import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { hexToString } from "@polkadot/util";
import { useApi } from "../utils/hooks";
import { useIsMounted } from "@osn/common/es/utils/hooks";
import styled from "styled-components";
import FlexBetween from "@osn/common-ui/es/styled/FlexBetween";
import { p_14_medium } from "@osn/common-ui/es/styles/textStyles";
import { getSymbolMetaByChain } from "@osn/common/es/utils/tokenValue";
import ValueDisplay from "@osn/common-ui/es/Chain/ValueDisplay";
import { LoadingIcon } from "@osn/common-ui";

const Wrapper = styled(FlexBetween)`
  margin-top: 8px;
  ${p_14_medium};
  line-height: 25px;

  > :first-child {
    color: #506176;
  }

  > :last-child {
    display: flex;
    align-items: center;
    color: #1e2134;
  }
`;

export default function BalanceInfo({ account, tokenIdentifier = "N" }) {
  const [symbol, setSymbol] = useState();
  const [decimals, setDecimals] = useState(0);
  const [balance, setBalance] = useState("0");
  const [loadingSymbol, setLoadingSymbol] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const isMounted = useIsMounted();
  const api = useApi();

  const setUnknownSymbol = () => {
    setSymbol(null);
    setDecimals(0);
    setLoadingSymbol(false);
  };

  const fetchAssetSymbol = useMemo(() => {
    return debounce(async (assetId) => {
      if (!api || assetId === "") {
        setUnknownSymbol();
        return;
      }

      if (assetId === "N") {
        const meta = getSymbolMetaByChain(account?.network);
        setSymbol(meta?.symbol);
        setDecimals(meta?.decimals);
        setLoadingSymbol(false);
        return;
      }

      try {
        const metadata = await api.query.assets.metadata(assetId);
        const { symbol: hexSymbol, decimals } = metadata.toJSON();

        if (hexSymbol === "0x") {
          setUnknownSymbol();
          return;
        }

        const symbol = hexToString(hexSymbol);
        if (isMounted.current) {
          setSymbol(symbol);
          setDecimals(decimals);
          setLoadingSymbol(false);
        }
      } catch (e) {
        setUnknownSymbol();
      }
    }, 300);
  }, [api, isMounted, account?.network]);

  const fetchAssetBalance = useMemo(() => {
    return debounce(async (assetId) => {
      if (!api || assetId === "" || !account?.address) {
        setBalance("0");
        setLoadingBalance(false);
        return;
      }

      try {
        let balance;

        if (assetId === "N") {
          const systemBalance = await api.query.system.account(account.address);
          const {
            data: { free },
          } = systemBalance.toJSON();
          balance = free;
        } else {
          const assetAccount = await api.query.assets.account(
            assetId,
            account?.address,
          );
          const { balance: hexBalance = 0 } = assetAccount.toJSON() || {};
          balance = hexBalance;
        }

        if (isMounted.current) {
          setBalance(balance);
          setLoadingBalance(false);
        }
      } catch (e) {
        setBalance("0");
        setLoadingBalance(false);
      }
    }, 300);
  }, [api, account?.address, isMounted]);

  useEffect(() => {
    setLoadingBalance(true);
    setLoadingSymbol(true);
    fetchAssetBalance(tokenIdentifier);
    fetchAssetSymbol(tokenIdentifier);
  }, [fetchAssetBalance, fetchAssetSymbol, tokenIdentifier]);

  return (
    <Wrapper>
      <span>Balance</span>
      <div>
        {loadingBalance || loadingSymbol ? (
          <LoadingIcon />
        ) : symbol === null ? (
          <div>0</div>
        ) : (
          <ValueDisplay
            value={balance}
            decimals={decimals}
            symbol={symbol}
            showAEM
          />
        )}
      </div>
    </Wrapper>
  );
}
