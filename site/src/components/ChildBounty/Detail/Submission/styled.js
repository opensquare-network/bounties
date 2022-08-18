import {
  FlexBetween,
  p_12_normal,
  secondary_blue_500,
  text_dark_accessory,
} from "@osn/common-ui";
import styled from "styled-components";

export {
  Count,
  IdentityUserWrapper,
  DescriptionWrapper,
} from "../Applicants/styled";

export const Wrapper = styled(FlexBetween)`
  align-items: flex-start;
`;

export const DescriptionLinkWrapper = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
