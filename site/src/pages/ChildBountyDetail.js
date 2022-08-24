import styled from "styled-components";
import Background from "components/Background";
import { Container } from "@osn/common-ui";
import Breadcrumb from "../components/Breadcrumb";
import { useParams } from "react-router";
import { capitalize } from "utils";
import { useEffect } from "react";
import ChildBountyDetail from "components/ChildBounty/Detail";
import { resolveBountyDetailRoute } from "utils/route";
import { useDispatch } from "react-redux";
import { useFetchChildBountyDetail } from "hooks/useFetchChildBountyDetail";

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
            path={[
              {
                title: `${capitalize(network)} #${bountyId}`,
                href: resolveBountyDetailRoute(network, bountyId),
              },
            ]}
            value={`Child #${childBountyId}`}
          />
          <ChildBountyDetail childBountyDetail={childBountyDetail} />
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
}
