import styled from "styled-components";
import {
  netural_grey_500,
  text_dark_accessory,
  p_12_medium,
  p_14_normal,
} from "@osn/common-ui";

export const Mark = styled.span`
  ${p_14_normal};
  color: ${text_dark_accessory};
  margin-right: 8px;
`;

export const SkillListWrapper = styled.ul`
  display: flex;
  list-style: none;
  padding-left: 0;
  gap: 8px;
  margin: 0;
`;

// TODO: it should be a tag component with rounded prop
export const SkillTag = styled.li`
  ${p_12_medium};
  color: ${netural_grey_500};
  box-shadow: 0 0 0 1px ${netural_grey_500};
  border-radius: 9999px;
  padding: 2px 8px;
  text-transform: capitalize;
`;
