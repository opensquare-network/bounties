import { FlexBetween, Flex, p_12_normal } from "@osn/common-ui";
import { text_dark_accessory } from "@osn/common-ui/es/styles/colors";
import styled, { css } from "styled-components";

export const TimeStatusWrapper = styled.div``;
export const AssignButtonWrapper = styled.div`
  display: none;
`;

export const Wrapper = styled(FlexBetween)`
  align-items: center;
  height: 56px;

  ${(p) =>
    p.hoverShowAssignButton &&
    css`
      &:hover {
        & ${AssignButtonWrapper} {
          display: block;
        }
        & ${TimeStatusWrapper} {
          display: none;
        }
      }
    `}
`;

export const IdentityUserWrapper = styled(Flex)`
  max-width: 232px;
  flex: 1;
  a {
    display: inline-flex;
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  }
`;
export const DescriptionWrapper = styled(Flex)`
  flex: 1;
`;
export const ActionWrapper = styled(Flex)`
  max-width: 120px;
  flex: 1;
`;

export const Count = styled.span`
  color: ${text_dark_accessory};
`;

export const ActionTimeWrapper = styled.div`
  div {
    ${p_12_normal};
  }
`;
