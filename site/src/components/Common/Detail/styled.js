import styled from "styled-components";

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  button + button {
    margin-left: 20px;
  }
`;

export const Group = styled.div`
  margin-bottom: 20px;
`;
