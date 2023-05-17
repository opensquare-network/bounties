import { FlexBetween } from "@osn/common-ui";
import {
  text_dark_accessory,
  text_dark_major,
} from "@osn/common-ui/es/styles/colors";
import {
  p_12_normal,
  p_14_medium,
  p_14_normal,
} from "@osn/common-ui";
import styled from "styled-components";

export const Item = styled(FlexBetween)`
  min-height: 56px;
`;

export const IndexWrapper = styled.div`
  min-width: 64px;
`;
export const Index = styled.span`
  ${p_14_normal};
  color: ${text_dark_accessory};
`;

export const Status = styled.div`
  min-width: 120px;
`;

export const TimeWrapper = styled.div`
  div {
    ${p_12_normal};
  }
`;

export const Title = styled.p`
  flex: 1;
  ${p_14_medium};
  color: ${text_dark_major};
  margin: 0;

  a {
    cursor: pointer;

    :hover {
      text-decoration: underline;
    }
  }
`;

export const MobileTitleGap = styled.div`
  margin: 10px 0;
`;
