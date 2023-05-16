import styled from "styled-components";
import { netural_grey_500, p_12_medium } from "@osn/common-ui";

export const SkillListWrapper = styled.ul`
  display: flex;
  list-style: none;
  padding-left: 0;
  gap: 8px;
  margin: 0;
`;

export const SkillTag = styled.span`
  ${p_12_medium};
  color: ${netural_grey_500};
  box-shadow: 0 0 0 1px ${netural_grey_500};
  border-radius: 9999px;
  padding: 2px 8px;
  text-transform: capitalize;
`;
