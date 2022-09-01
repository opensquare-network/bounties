import { useParams } from "react-router";
import styled from "styled-components";

import Background from "components/Background";
import { Container } from "@osn/common-ui";
import Breadcrumb from "../components/Breadcrumb";
import Detail from "../components/Bounty/Detail";
import { useEffect } from "react";
import { capitalize } from "utils";
import { useFetchBountyDetail } from "hooks/useFetchBountyDetail";
import { useDispatch } from "react-redux";

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

export default function BountyDetail() {
  const { network, bountyId } = useParams();
  const dispatch = useDispatch();

  const { bountyDetail, fetchBountyDetail, resetBountyDetail } =
    useFetchBountyDetail();

  useEffect(() => {
    dispatch(fetchBountyDetail());
    return () => dispatch(resetBountyDetail());
  }, [dispatch, fetchBountyDetail, resetBountyDetail]);

  return (
    <Wrapper>
      <Background />
      <Container>
        <ContentWrapper>
          <Breadcrumb value={`${capitalize(network)} #${bountyId}`} />
          <Detail bountyDetail={bountyDetail} />
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
}
