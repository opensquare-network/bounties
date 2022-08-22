import {
  Flex,
  FlexBetween,
  p_12_normal,
  secondary_blue_500,
  text_dark_accessory,
} from "@osn/common-ui";
import { MOBILE_SIZE } from "@osn/constants";
import styled from "styled-components";

export { Count, IdentityUserWrapper, ListWrapper } from "../Applicants/styled";

export const ItemWrapper = styled(FlexBetween)`
  max-width: 100%;
  align-items: flex-start;

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    display: block;
  }
`;

export const DescriptionWrapper = styled(Flex)`
  flex: 1;
  padding-right: 24px;

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    margin-top: 16px;
    padding-right: 0;
  }
`;

export const DescriptionLinkWrapper = styled.div`
  ${p_12_normal};
  margin-top: 8px;

  span {
    color: ${text_dark_accessory};
  }

  a {
    color: ${secondary_blue_500};
  }
`;

export const DescriptionInnerWrapper = styled.div`
  max-width: 100%;
`;
