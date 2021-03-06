import styled from "styled-components";
import { MOBILE_SIZE } from "@osn/constants";
import Discussions from "../../Bounty/Detail/Discussions";
import ChildBountyDetailApplicants from "./Applicants";
import ChildBountyDetailMeta from "./Meta";

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

export default function ChildBountyDetail({ childBountyDetail }) {
  return (
    <Wrapper>
      <ChildBountyDetailMeta
        type="Child Bounty"
        childBountyDetail={childBountyDetail}
      />
      <ChildBountyDetailApplicants childBountyDetail={childBountyDetail} />

      <Discussions
        network={childBountyDetail?.network}
        bountyId={childBountyDetail?.bountyIndex}
      />
    </Wrapper>
  );
}
