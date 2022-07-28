import { FlexBetween } from "@osn/common-ui";
import {
  text_dark_accessory,
  text_dark_major,
} from "@osn/common-ui/es/styles/colors";
import {
  p_12_normal,
  p_14_medium,
  p_14_normal,
} from "@osn/common-ui/es/styles/textStyles";
import styled from "styled-components";

export const ListWrapper = styled.div`
  margin-bottom: 16px;
`;

export const Item = styled(FlexBetween)`
  min-height: 56px;
`;

export const Index = styled.div`
  min-width: 64px;
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
