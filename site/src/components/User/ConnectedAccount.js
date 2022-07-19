import styled, { css } from "styled-components";
import { useDispatch } from "react-redux";
import { logout } from "../../store/reducers/accountSlice";
import { ReactComponent as ExitIcon } from "@osn/common-ui/es/Account/exit.svg";
import { ReactComponent as CircleIcon } from "@osn/common-ui/es/Account/circle.svg";
import { p_14_medium } from "@osn/common-ui/es/styles/textStyles";
import NetworkUser from "./NetworkUser";
import { encodeNetworkAddress } from "@osn/common/src/utils/address";
import FlexBetween from "@osn/common-ui/es/styled/FlexBetween";

const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
  @media screen and (max-width: 768px) {
    padding: 0;
    > :first-child {
      margin-top: 20px;
    }

    > :last-child {
      margin-bottom: 20px;
    }

    margin: 0;
    width: 100%;
    text-align: center;
  }
`;

const AccountWrapper = styled(FlexBetween)`
  ${p_14_medium};

  div {
    display: flex;
    align-items: center;

    .ui--IdentityIcon {
      display: flex !important;
      align-items: center !important;
    }
  }

  > div > :first-child {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  > div > :nth-child(2) {
    margin-right: 4px;
  }

  .button,
  .connect {
    width: 100%;
  }
`;

const AccountWrapperPC = styled(AccountWrapper)`
  border: 1px solid #e2e8f0;

  :hover {
    border: 1px solid #b7c0cc;
  }

  ${(p) =>
    p.show &&
    css`
      border: 1px solid #b7c0cc;
    `}
  padding: 7px 15px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MenuWrapper = styled.div`
  cursor: auto;
  min-width: 240px;
  position: absolute;
  right: 0;
  top: 100%;
  background: #ffffff;
  border: 1px solid #f0f3f8;
  padding: 16px 16px 8px;
  z-index: 1;

  box-shadow: 0px 4px 31px rgba(26, 33, 44, 0.06),
    0px 0.751293px 8px rgba(26, 33, 44, 0.04);

  @media screen and (max-width: 768px) {
    margin-top: 19px;
    border: none;
    box-shadow: none;
    width: 100%;
    position: initial;
    padding: 0;
    border-bottom: 20px solid white;
  }

  .connect {
    margin: auto;
  }
`;

const MenuItem = styled.div`
  margin-bottom: 8px;
  cursor: pointer;
  font-family: Inter, sans-serif;
  ${p_14_medium};
`;

const MenuDivider = styled.div`
  height: 1px;
  background: #f0f3f8;
  margin: 12px 0;
`;

const LogoutWrapper = styled(FlexBetween)`
  color: #506176;

  :hover {
    color: #1e2134;
  }
`;

function ConnectedAccount({
  account,
  showMenu,
  setShowMenu,
  setConnectWalletModalVisible = () => {},
}) {
  const dispatch = useDispatch();
  const network = account.network;
  const address = encodeNetworkAddress(account.address, network);

  const onSwitch = () => {
    setConnectWalletModalVisible(true);
    setShowMenu(false);
  };

  const onLogout = () => {
    dispatch(logout());
    setShowMenu(false);
  };

  const Menu = (
    <MenuWrapper onClick={(e) => e.stopPropagation()}>
      {account && (
        <>
          <NetworkUser
            address={address}
            network={network}
            iconSize={12}
            tooltipPosition="down"
          />
          <MenuDivider />
          <MenuItem>
            <LogoutWrapper onClick={onSwitch}>
              Switch address
              <CircleIcon />
            </LogoutWrapper>
          </MenuItem>
          <MenuItem>
            <LogoutWrapper onClick={onLogout}>
              Log out
              <ExitIcon />
            </LogoutWrapper>
          </MenuItem>
        </>
      )}
    </MenuWrapper>
  );

  return (
    <Wrapper>
      <AccountWrapperPC
        onClick={() => {
          setShowMenu(!showMenu);
        }}
      >
        <NetworkUser
          address={address}
          network={network}
          iconSize={12}
          tooltipPosition="down"
          noLink={true}
        />
      </AccountWrapperPC>
      {showMenu && <>{Menu}</>}
    </Wrapper>
  );
}

export default ConnectedAccount;
