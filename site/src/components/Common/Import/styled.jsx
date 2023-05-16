import styled from "styled-components";
import { p_16_semibold } from "@osn/common-ui";

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  ${p_16_semibold};
  color: #1e2134;
`;

export const ErrorMessage = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: #ee4444;
`;
