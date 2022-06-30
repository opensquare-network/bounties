import { useState, useEffect, useCallback } from "react";
import { isWeb3Injected, web3Enable } from "@polkadot/extension-dapp";
import { useDispatch, useSelector } from "react-redux";
import { accountSelector, setAccount } from "../store/reducers/accountSlice";

import Modal from "@osn/common-ui/es/Modal";
import AccountSelector from "./Account/AccountSelector";
import styled from "styled-components";
import ChainSelector from "@osn/common-ui/es/Chain/ChainSelector";
import { closeConnect } from "../store/reducers/showConnectSlice";
import {
  p_14_normal,
  p_16_semibold,
  p_20_semibold,
} from "@osn/common-ui/es/styles/textStyles";
import { polkadotWeb3Accounts } from "@osn/common/src/extension";
import { useIsMounted } from "@osn/common/src/utils/hooks";
import { AVAILABLE_NETWORKS, PROJECT_NAME } from "utils/constants";

const Wrapper = styled.div``;

const StyledTitle = styled.header`
  ${p_20_semibold};
  color: #1e2134;
  margin-bottom: 8px;
`;

const StyledText = styled.p`
  ${p_16_semibold};
  color: #1e2134;
`;

const StyledDescription = styled.p`
  ${p_14_normal};
  color: #506176;
`;

export default function ConnectModal() {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [hasExtension, setHasExtension] = useState(null);
  const account = useSelector(accountSelector);
  const [accounts, setAccounts] = useState([]);
  const [chain, setChain] = useState({ network: "polkadot" });
  const [address, setAddress] = useState();
  const [isPolkadotAccessible, setIsPolkadotAccessible] = useState(null);
  const availableNetworks = AVAILABLE_NETWORKS;

  const getAddresses = useCallback(async () => {
    const extensionAccounts = await polkadotWeb3Accounts();
    const accounts = (extensionAccounts || []).map((item) => {
      const {
        address,
        meta: { name },
      } = item;
      return {
        address,
        name,
      };
    });
    if (isMounted.current) {
      setAccounts(accounts);
      setAddress(accounts[0]?.address);
    }
  }, [isMounted]);

  useEffect(() => {
    (async () => {
      const web3Apps = await web3Enable(PROJECT_NAME);
      if (isMounted.current) {
        setHasExtension(isWeb3Injected);
      }
      if (!isWeb3Injected) {
        return;
      }
      const polkadotEnabled = web3Apps?.length > 0;
      if (isMounted.current) {
        setIsPolkadotAccessible(polkadotEnabled);
      }
      if (!polkadotEnabled) {
        return;
      }
      getAddresses();
    })();
  }, [isMounted, getAddresses]);

  const doConnect = async () => {
    try {
      dispatch(
        setAccount({
          address,
          network: chain.network,
        })
      );
      dispatch(closeConnect());
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => dispatch(closeConnect());

  return (
    <Wrapper>
      <Modal
        open={isPolkadotAccessible && accounts.length > 0}
        okText="Connect"
        onOk={doConnect}
        onClose={closeModal}
      >
        <StyledTitle>Connect Wallet</StyledTitle>

        <StyledText>Chain</StyledText>
        <ChainSelector
          chains={availableNetworks}
          onSelect={(chain) => setChain(chain)}
          selected={account?.network}
        />

        <StyledText>Account</StyledText>
        <AccountSelector
          accounts={accounts}
          onSelect={(account) => setAddress(account?.address)}
          chain={chain}
          selected={account?.address}
        />
      </Modal>

      <Modal
        open={isPolkadotAccessible && accounts.length === 0}
        onClose={closeModal}
        okText="Create/Import addresses"
        okButtonProps={{ primary: false, color: "orange" }}
        onOk={() => {
          closeModal();
          const newWindow = window.open(
            "https://polkadot.js.org/extension/",
            "_blank",
            "noopener,noreferrer"
          );
          if (newWindow) newWindow.opener = null;
        }}
      >
        <StyledTitle>Connect Wallet</StyledTitle>

        <StyledDescription>
          Polkadot-js extension is connected, but no account found. Please
          create or import some accounts first.
        </StyledDescription>
      </Modal>

      <Modal
        open={hasExtension === false}
        onClose={closeModal}
        okText={`Polkadot{.js} Extension`}
        okButtonProps={{ primary: false, color: "orange" }}
        onOk={() => {
          closeModal();
          const newWindow = window.open(
            "https://polkadot.js.org/extension/",
            "_blank",
            "noopener,noreferrer"
          );
          if (newWindow) newWindow.opener = null;
        }}
      >
        <StyledTitle>Connect Wallet</StyledTitle>

        <StyledDescription>
          Polkadot-js extension not detected. No web3 account could be found.
          Visit this page on a computer with polkadot-js extension.
        </StyledDescription>
      </Modal>

      <Modal
        open={hasExtension && isPolkadotAccessible === false}
        onClose={closeModal}
        okText="Got it."
        onOk={closeModal}
        okButtonProps={{ primary: false, color: "orange" }}
      >
        <StyledTitle>Connect Wallet</StyledTitle>

        <StyledDescription>
          Polkadot-js extension is detected but unaccessible, please go to
          Polkadot-js extension, settings, and check Manage Website Access
          section.
        </StyledDescription>
      </Modal>
    </Wrapper>
  );
}
