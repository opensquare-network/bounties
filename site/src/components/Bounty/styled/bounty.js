import { FlexCenter, FlexBetween } from "@osn/common-ui";
import {
  text_dark_accessory,
  text_dark_major,
  text_dark_minor,
} from "@osn/common-ui/es/styles/colors";
import {
  p_14_normal,
  p_16_semibold,
} from "@osn/common-ui/es/styles/textStyles";
import styled from "styled-components";
import { MOBILE_SIZE } from "@osn/constants";

export const Head = styled(FlexCenter)`
  flex-direction: column;
`;

export const Title = styled.h4`
  ${p_16_semibold};
  color: ${text_dark_major};
  margin-top: 20px;
  margin-bottom: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
  overflow: hidden;

  a {
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  }
`;

export const SubTitle = styled.p`
  ${p_14_normal};
  color: ${text_dark_accessory};
`;

export const Detail = styled(FlexBetween)`
  color: ${text_dark_minor};

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    .hide-in-mobile {
      display: none;
    }
  }
`;
