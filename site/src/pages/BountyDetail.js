import { useNavigate, useParams } from "react-router";
import styled from "styled-components";

import Background from "components/Background";
import { Container } from "@osn/common-ui";
import Breadcrumb from "../components/Breadcrumb";
import Detail from "../components/Bounty/Detail";
import { useEffect } from "react";
import serverApi from "services/serverApi";
import { capitalize } from "utils";
import { useAsyncState } from "@osn/common";

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

  const navigate = useNavigate();

  const {
    state: bountyDetail,
    execute,
    isLoading,
  } = useAsyncState(
    () =>
      serverApi
        .fetch(`network/${network}/bounties/${bountyId}`)
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
  useEffect(execute, [network, bountyId, navigate]);

  return (
    <Wrapper>
      <Background />
      <Container>
        <ContentWrapper>
          <Breadcrumb value={`${capitalize(network)} #${bountyId}`} />
          <Detail
            bountyDetail={bountyDetail}
            loading={isLoading}
            reloadData={execute}
          />
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
}
