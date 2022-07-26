import { FlexBetween, Flex } from "@osn/common-ui";
import { text_dark_accessory } from "@osn/common-ui/es/styles/colors";
import styled from "styled-components";

export const Wrapper = styled(FlexBetween)`
  align-items: center;
`;

export const IdentityUserWrapper = styled(Flex)`
  flex: 1;
  a {
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  }
`;
export const ApplicantWrapper = styled(Flex)`
  flex: 1;
  max-width: 50%;
`;
export const TimeWrapper = styled(Flex)`
  flex: 1;
  justify-content: flex-end;
`;

export const Count = styled.span`
  color: ${text_dark_accessory};
`;
