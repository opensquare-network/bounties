import styled from "styled-components";
import Background from "components/Background";
import { Container, Breadcrumb } from "@osn/common-ui";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { capitalize } from "utils";
import { useAsyncState } from "@osn/common";
import serverApi from "services/serverApi";
import { useEffect } from "react";
import ChildBountyDetail from "components/ChildBounty/Detail";

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

export default function PageChildBountyDetail() {
  const { network, bountyId, childBountyId } = useParams();
  const navigate = useNavigate();

  const routes = [
    {
      link: "/",
      name: "Explore",
    },
    {
      link: `/network/${network}/bounty/${bountyId}`,
      name: `${capitalize(network)} #${bountyId}`,
    },
    {
      name: `Child #${childBountyId}`,
    },
  ];

  const { state: childBountyDetail, execute } = useAsyncState(
    () =>
      serverApi
        .fetch(
          `/network/${network}/child-bounties/${bountyId}_${childBountyId}`,
        )
        .then(({ result, error }) => {
          if (result) {
            return result;
          }
          if (error) {
            return Promise.reject(error);
          }
        }),
    null,
    {
      immediate: false,
      onError() {
        navigate("/404");
      },
    },
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(execute, [network, bountyId, childBountyId, navigate]);

  return (
    <Wrapper>
      <Background />

      <Container>
        <ContentWrapper>
          <Breadcrumb
            backButtonRender={(button) => <Link to="/">{button}</Link>}
            routes={routes}
          />
          <ChildBountyDetail childBountyDetail={childBountyDetail} />
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
}
