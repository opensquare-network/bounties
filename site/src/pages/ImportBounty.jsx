import styled from "styled-components";

import { Container } from "@osn/common-ui";
import BountyImport from "../components/Bounty/Import";
import Breadcrumb from "../components/Breadcrumb";

const Wrapper = styled.div`
  position: relative;
  padding: 40px 0 64px;
`;

const ContentWrapper = styled.div`
  position: relative;

  > :not(:first-child) {
    margin-top: 24px;
  }
`;

export default function ImportBounty() {
  return (
    <Wrapper>
      <Container>
        <ContentWrapper>
          <Breadcrumb value="Import a Bounty" />
          <BountyImport />
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
}
