import { useEffect, useState } from "react";
import styled from "styled-components";
import usePolkadotExtension from "../../hooks/usePolkadotExtension";
import { AVAILABLE_NETWORKS } from "../../utils/constants";
import ChainSelector from "@osn/common-ui/es/Chain/ChainSelector";
import Closeable from "./Closeable";
import { StyledText } from "./styled";
import NotAccessible from "./NotAccessible";
import NoAccount from "./NoAccount";
import NoExtension from "./NoExtension";
import AccountSelector from "../Account/AccountSelector";
import { ActionBar } from "./styled";
import ConnectButton from "./connectButton";

const Wrapper = styled.div``;

export default function Connect() {
  const [element, setElement] = useState(null);
  const [address, setAddress] = useState();
  const [normalizedAccounts, setNormalizedAccounts] = useState([]);
  const [chain, setChain] = useState(AVAILABLE_NETWORKS[0]);

  const { accounts, hasExtension, isPolkadotExtensionAccessible, detecting } = usePolkadotExtension();

  console.log(accounts, hasExtension, isPolkadotExtensionAccessible, detecting)

  useEffect(() => {
    setNormalizedAccounts((accounts || []).map(({address, meta: {name}}) => ({address, name})));
  }, [accounts]);

  useEffect(() => {
    setAddress(normalizedAccounts[0]?.address)
  }, [normalizedAccounts])

  useEffect(() => {
    if (detecting) {
      return setElement(null);
    }

    if (!hasExtension) {
      return setElement(<NoExtension />);
    }

    if (!isPolkadotExtensionAccessible) {
      return setElement(<NotAccessible />);
    }

    if (accounts.length <= 0) {
      return setElement(<NoAccount />);
    }

    setElement(
      <>
        <StyledText>Account</StyledText>
        <AccountSelector
          accounts={accounts}
          onSelect={(account) => {
            setAddress(account?.address);
          }}
          chain={chain}
        />

        <ActionBar>
          <ConnectButton address={address} network={chain.network} />
        </ActionBar>
      </>
    );
  }, [accounts, address, chain, detecting, hasExtension, isPolkadotExtensionAccessible])

  return (
    <Wrapper>
      <Closeable open={!detecting}>
        <StyledText>Chain</StyledText>
        <ChainSelector
          chains={AVAILABLE_NETWORKS}
          onSelect={(chain) => setChain(chain)}
        />
        { element }
      </Closeable>
    </Wrapper>
  );
}