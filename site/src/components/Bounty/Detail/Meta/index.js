import styled from "styled-components";

import Card from "@osn/common-ui/es/styled/Card";
import Title from "./Title";
import Info from "./Info";
import Description from "./Description";
import Share from "./Share";
import DetailLoader from "@osn/common-ui/es/Skeleton/DetailLoader";
import JoinGroupButton from "./JoinGroupButton";

const Wrapper = styled(Card)`
  > :not(:first-child) {
    padding-top: 20px;
    border-top: solid 1px #f0f3f8;
  }
  > :not(:last-child) {
    padding-bottom: 20px;
  }

  .post-detail-resolve {
    padding-top: 0;
    border-top: none;
  }
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function BountyMeta({ bountyDetail }) {
  if (!bountyDetail) {
    return <DetailLoader />;
  }

  return (
    <Wrapper>
      <Title bountyDetail={bountyDetail} />
      <Info bountyDetail={bountyDetail} />
      <Description bountyDetail={bountyDetail} />
      <BottomBar>
        <Share />
        <JoinGroupButton />
      </BottomBar>
    </Wrapper>
  );
}
