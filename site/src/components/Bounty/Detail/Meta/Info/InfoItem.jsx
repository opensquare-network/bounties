import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  > div {
    display: flex;
    align-items: center;
  }
`;

export default function InfoItem({ title, content }) {
  return (
    <Wrapper>
      <div>{title}</div>
      <div>{content}</div>
    </Wrapper>
  );
}
