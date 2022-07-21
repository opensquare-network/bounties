import { useNavigate, useParams } from "react-router";
import styled from "styled-components";

import Background from "components/Background";
import { Container } from "@osn/common-ui";
import Breadcrumb from "../components/Breadcrumb";
import Detail from "../components/Bounty/Detail";
import { useState, useEffect } from "react";
import serverApi from "services/serverApi";
import { useIsMounted } from "@osn/common/src";
import { capitalize } from "utils";

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

  const [loading, setLoading] = useState(false);
  const [bountyDetail, setBountyDetail] = useState(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    setLoading(true);
    serverApi
      .fetch(`network/${network}/bounties/${bountyId}`)
      .then(({ result }) => {
        if (result) {
          if (isMounted.current) {
            setBountyDetail(result);
          }
        } else {
          navigate("/404");
        }
      })
      .finally(() => {
        if (isMounted.current) {
          setLoading(false);
        }
      });
  }, [network, bountyId, isMounted, navigate]);

  return (
    <Wrapper>
      <Background />
      <Container>
        <ContentWrapper>
          <Breadcrumb value={`${capitalize(network)} #${bountyId}`} />
          <Detail bountyDetail={bountyDetail} loading={loading} />
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
}
