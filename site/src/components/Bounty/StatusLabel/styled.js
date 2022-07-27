import { p_14_medium } from "@osn/common-ui/es/styles/textStyles";
import styled, { css } from "styled-components";

export const Wrapper = styled.span`
  ${p_14_medium};
  text-transform: capitalize;

  ${(p) => css`
    color: ${p.hex};
  `}
`;
