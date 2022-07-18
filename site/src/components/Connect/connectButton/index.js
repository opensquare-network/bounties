import { memo } from "react";
import Button from "@osn/common-ui/es/styled/Button";
import { ReactComponent as Polkadot } from "./polkadot.svg";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setAccount } from "../../../store/reducers/accountSlice";
import { closeConnect, } from "../../../store/reducers/showConnectSlice";

const Wrapper = styled.span`
  display: flex;
  align-items: center;

  svg {
    margin-right: 8px;
  }
`;

function ConnectButton({ address, network }) {
  const dispatch = useDispatch();

  return (
    <Button
      primary
      onClick={() => {
        dispatch(
          setAccount({
            address,
            network: network,
          })
        );
        dispatch(closeConnect());
      }}
      style={{ height: 42 }}
    >
      <Wrapper>
        <Polkadot />
        Connect
      </Wrapper>
    </Button>
  );
}

export default memo(ConnectButton);
