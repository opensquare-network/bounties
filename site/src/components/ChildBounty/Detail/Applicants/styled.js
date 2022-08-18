import { FlexBetween, Flex, p_12_normal } from "@osn/common-ui";
import { text_dark_accessory } from "@osn/common-ui/es/styles/colors";
import styled, { css } from "styled-components";

export const TimeStatusWrapper = styled.div``;
export const AssignButtonWrapper = styled.div`
  display: none;
`;

export const Wrapper = styled(FlexBetween)`
  align-items: flex-start;
  height: 36px;
  max-height: 56px;

  ${(p) =>
    p.hoverShouldShowAssignButton &&
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
  padding-right: 24px;
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
  max-width: calc(100% - 232px - 120px);
  padding-right: 24px;
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
