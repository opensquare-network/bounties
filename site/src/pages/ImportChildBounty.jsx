import styled from "styled-components";

import { Container } from "@osn/common-ui";
import ChildBountyImport from "../components/ChildBounty/Import";
import Breadcrumb from "../components/Breadcrumb";
import { useSearchParams } from "react-router-dom";
import { capitalize } from "utils";
import { resolveBountyDetailRoute } from "@/utils/route";

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
  const [searchParams] = useSearchParams();
  const network = searchParams.get("network");
  const parentBountyId = searchParams.get("parentBountyId");

  const path = [
    {
      title: `${capitalize(network)} #${parentBountyId}`,
      href: resolveBountyDetailRoute(network, parentBountyId),
    },
  ];
  return (
    <Wrapper>
      <Container>
        <ContentWrapper>
          <Breadcrumb path={path} value="Import a Child Bounty" />
          <ChildBountyImport
            network={network}
            parentBountyId={parentBountyId}
          />
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
}
