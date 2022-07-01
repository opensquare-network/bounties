import styled from "styled-components";

import { ChainIcon } from "@osn/common-ui/es";
import IdentityOrAddr from "./IdentityOrAddr";
import { p_14_medium } from "@osn/common-ui/es/styles/textStyles";
import Flex from "@osn/common-ui/es/styled/Flex";

const Wrapper = styled(Flex)`
  ${p_14_medium};
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

export default function Name({ network, address, noLink }) {
  return (
    <Wrapper>
      <ChainIcon chainName={network} size={12} />
      <IdentityOrAddr network={network} address={address} noLink={noLink} />
    </Wrapper>
  );
}
