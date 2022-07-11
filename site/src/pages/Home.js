import styled from "styled-components";

import { Container } from "@osn/common-ui";
import Background from "components/Background";
import { MOBILE_SIZE } from "@osn/constants";

const Wrapper = styled.div`
  position: relative;
  padding: 40px 0 64px;
  @media screen and (max-width: ${MOBILE_SIZE}px) {
    padding-top: 20px;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  > :not(:first-child) {
    margin-top: 24px;
  }
`;

export default function Home() {
  return (
    <Wrapper>
      <Background />
      <Container>
        <ContentWrapper>Home page</ContentWrapper>
      </Container>
    </Wrapper>
  );
}
