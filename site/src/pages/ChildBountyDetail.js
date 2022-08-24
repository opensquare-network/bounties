import styled from "styled-components";
import Background from "components/Background";
import { Container, Breadcrumb } from "@osn/common-ui";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { capitalize } from "utils";
import { useEffect, useMemo } from "react";
import ChildBountyDetail from "components/ChildBounty/Detail";
import { resolveBountyDetailRoute } from "utils/route";
import { useDispatch } from "react-redux";
import { useFetchChildBountyDetail } from "hooks/useFetchChildBountyDetail";
import { useIsScreen } from "@osn/common";

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
  const dispatch = useDispatch();
  const {
    childBountyDetail,
    fetchChildBountyDetail,
    resetChildBountyDetail,
    childBountyDetailEffectDeps,
  } = useFetchChildBountyDetail();

  const { isMobile } = useIsScreen();

  const routes = useMemo(() => {
    const items = [
      {
        link: "/",
        name: "Explore",
      },
      {
        link: resolveBountyDetailRoute(network, bountyId),
        name: `${capitalize(network)} #${bountyId}`,
      },
      {
        name: `Child #${childBountyId}`,
      },
    ];

    if (isMobile) {
      return [items[items.length - 1]];
    }

    return items;
  }, [isMobile, network, bountyId, childBountyId]);

  useEffect(() => {
    dispatch(fetchChildBountyDetail());
    return resetChildBountyDetail;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, ...childBountyDetailEffectDeps]);

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
