import styled from "styled-components";

import { Container, FlexBetween, FlexCenter } from "@osn/common-ui";
import Background from "components/Background";
import { MOBILE_SIZE } from "@osn/constants";
import {
  h3_36_bold,
  p_16_semibold,
  p_20_semibold,
  h5_24_bold,
} from "@osn/common-ui/es/styles/textStyles";
import ChildBountyList from "components/Bounty/ChildBountyList";
import BountyList from "components/Bounty/BountyList";
import { Link } from "react-router-dom";
import { text_dark_minor } from "@osn/common-ui/es/styles/colors";

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
  margin-bottom: 0;
  ${h3_36_bold};

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    ${h5_24_bold};
  }
`;

const SubTitle = styled.p`
  ${p_20_semibold}
`;

const ImportLink = styled(Link)`
  ${p_16_semibold};
  color: ${text_dark_minor};
  cursor: pointer;

  img {
    margin-right: 12.27px;
  }
`;

const BountyListWrapper = styled.div`
  margin-top: 20px;
`;

export default function Home() {
  return (
    <Wrapper>
      <Background />
      <Container>
        <ContentWrapper>
          <div>
            <FlexBetween>
              <Title>Bounties</Title>
              <ImportLink to="/import_bounty">
                <FlexCenter>
                  <img src="/imgs/icons/add.svg" alt="" />
                  <span>Import a Bounty</span>
                </FlexCenter>
              </ImportLink>
            </FlexBetween>

            <BountyListWrapper>
              <BountyList />
            </BountyListWrapper>
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
