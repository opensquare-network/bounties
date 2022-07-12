import styled from "styled-components";

import { Container } from "@osn/common-ui";
import Background from "components/Background";
import { MOBILE_SIZE } from "@osn/constants";
import { h3_36_bold, p_20_semibold } from "@osn/common-ui/es/styles/textStyles";
import ChildBountyList from "components/Bounty/ChildBountyList";

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

const Title = styled.h3`
  ${h3_36_bold}
`;

const SubTitle = styled.p`
  ${p_20_semibold}
`;

export default function Home() {
  return (
    <Wrapper>
      <Background />
      <Container>
        <ContentWrapper>
          <div>
            <Title>Bounties</Title>
          </div>

          <div>
            <SubTitle>Child Bounties</SubTitle>

            <ChildBountyList></ChildBountyList>
          </div>
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
}
