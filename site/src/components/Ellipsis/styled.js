import styled from "styled-components";

export const EllipsisWrapper = styled.span`
  word-break: break-all;

  display: -webkit-inline-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
