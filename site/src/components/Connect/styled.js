import styled from "styled-components";
import { p_14_normal, p_16_semibold, p_20_semibold, } from "@osn/common-ui/es/styles/textStyles";

export const StyledTitle = styled.header`
  ${ p_20_semibold };
  color: #1e2134;
  margin-bottom: 8px;
`;

export const StyledText = styled.p`
  ${ p_16_semibold };
  color: #1e2134;
`;

export const StyledDescription = styled.p`
  ${ p_14_normal };
  color: #ee4444;
`;

export const ActionBar = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-top: 20px;
`;
