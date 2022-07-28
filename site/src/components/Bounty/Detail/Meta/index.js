import styled from "styled-components";

import { Card, Divider } from "@osn/common-ui";
import Title from "./Title";
import Info from "./Info";
import Description from "./Description";
import Share from "./Share";
// import JoinGroupButton from "./JoinGroupButton";
import {
  descriptionLoading,
  metaLoading,
} from "components/Bounty/styled/metaLoading";

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function BountyMeta({ bountyDetail, type }) {
  if (!bountyDetail) {
    return <Card head={metaLoading}>{descriptionLoading}</Card>;
  }

  return (
    <Card
      head={
        <>
          <Title type={type} bountyDetail={bountyDetail} />
          <Divider />
          <Info bountyDetail={bountyDetail} />
        </>
      }
    >
      <Description bountyDetail={bountyDetail} />
      <Divider />
      <BottomBar>
        <Share />
        {/* <JoinGroupButton /> */}
      </BottomBar>
    </Card>
  );
}
