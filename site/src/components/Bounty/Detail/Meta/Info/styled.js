import styled from "styled-components";

export const InfoWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  column-gap: 24px;
  row-gap: 20px;
  > div {
    width: 230px;
  }
`;

export const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: #506176;
  gap: 5px;
`;

export const InfoContent = styled.div`
  max-width: 100%;
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #1e2134;
  gap: 8px;

  a {
    cursor: pointer;

    :hover {
      text-decoration: underline;
    }
  }
`;
