import React from "react";
import styled from "styled-components";

import { Header, Flex, FlexBetween } from "@osn/common-ui";
import NotificationBell from "./NotificationBell";
import ConnectModal from "./ConnectModal";
import { accountSelector } from "../store/reducers/accountSlice";
import { useRef, useState } from "react";
import ConnectWallet from "./ConnectWallet";
import NodeSelect from "./NodeSelect";
import { useDispatch, useSelector } from "react-redux";
import ConnectedAccount from "./User/ConnectedAccount";
import { useOnClickOutside, useWindowSize } from "@osn/common/src/utils/hooks";
import useUpdateNodesDelay from "utils/useUpdateNodesDelay";
import {
  popUpConnect,
  showConnectSelector,
} from "../store/reducers/showConnectSlice";
import MobileMenu from "./MobileMenu";
import ProductSwitch from "./ProductSwitch";
import { MOBILE_SIZE } from "@osn/consts";
import { NavLink } from "react-router-dom";

const RightWrapper = styled(Flex)`
  > :not(:first-child) {
    margin-left: 16px;
  }
`;

const ContentWrapper = styled(FlexBetween)`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export default function PageHeader() {
  const dispatch = useDispatch();
  const windowSize = useWindowSize();
  const showConnect = useSelector(showConnectSelector);
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, (event) => {
    // connect modal is at body level, doesn't contained in the <Header/>, so exclude manually
    if (document?.querySelector(".modals")?.contains(event.target)) {
      return;
    }
    setShowMenu(false);
  });
  const account = useSelector(accountSelector);
  useUpdateNodesDelay(account?.network);

  return (
    <Header
      logoRender={(logo) => (
        <NavLink style={{ cursor: "pointer" }} to="/">
          {logo}
        </NavLink>
      )}
    >
      <ContentWrapper>
        <ProductSwitch />

        <RightWrapper ref={ref}>
          {windowSize.width > MOBILE_SIZE ? (
            account ? (
              <>
                <NotificationBell />
                <ConnectedAccount
                  {...{ showMenu, setShowMenu, account }}
                  showNetwork
                />
                <NodeSelect small chain={account?.network} />
              </>
            ) : (
              <ConnectWallet onClick={() => dispatch(popUpConnect())} />
            )
          ) : (
            <>
              <MobileMenu />
            </>
          )}
          {showConnect && <ConnectModal />}
        </RightWrapper>
      </ContentWrapper>
    </Header>
  );
}
