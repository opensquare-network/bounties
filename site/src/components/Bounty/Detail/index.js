import styled from "styled-components";

import Meta from "./Meta";
import Discussions from "./Discussions";
import { MOBILE_SIZE } from "@osn/constants";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    flex-wrap: wrap;
  }

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    margin: 0 -16px;
  }

  gap: 20px;
`;

export default function BountyDetail({ bountyDetail, loading = false }) {
  return (
    <Wrapper>
      <Meta bountyDetail={bountyDetail} />
      <Discussions network={bountyDetail?.network} bountyId={bountyDetail?.bountyIndex} />
    </Wrapper>
  );
}
