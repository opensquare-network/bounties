import styled from "styled-components";

import { Container } from "@osn/common-ui";
import ChildBountyImport from "../components/ChildBounty/Import";
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

export default function ImportChildBounty() {
  return (
    <Wrapper>
      <Container>
        <ContentWrapper>
          <Breadcrumb value="Import a Child Bounty" />
          <ChildBountyImport />
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
}
