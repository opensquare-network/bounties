import { FlexBetween, Flex, p_12_normal } from "@osn/common-ui";
import { text_dark_accessory } from "@osn/common-ui/es/styles/colors";
import { MOBILE_SIZE } from "@osn/constants";
import styled, { css } from "styled-components";

export const TimeStatusWrapper = styled.div``;
export const AssignButtonWrapper = styled.div`
  display: none;
`;

export const Wrapper = styled(FlexBetween)`
  align-items: flex-start;
  min-height: 42px;

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

export const ListWrapper = styled.div`
  margin-top: 32px;
`;

export const IdentityUserWrapper = styled(Flex)`
  width: 232px;
  max-width: 232px;
  margin-right: 24px;

  a {
    display: inline-flex;
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  }

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    width: 100%;
    max-width: 100%;
    margin-right: 0;
  }
`;
export const DescriptionWrapper = styled(Flex)`
  flex: 1;
  width: 616px;
  max-width: 616px;
  margin-right: 24px;

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    width: 100%;
    max-width: 100%;
    margin-right: 0;
  }
`;
export const ActionWrapper = styled(Flex)`
  width: 120px;
  max-width: 120px;
  flex: 1;

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    width: 100%;
    max-width: 100%;
  }
`;

export const Count = styled.span`
  color: ${text_dark_accessory};
`;

export const ActionTimeWrapper = styled.div`
  div {
    ${p_12_normal};
  }
`;

export const MobileDescriptionGap = styled.div`
  margin: 8px 0;
`;
