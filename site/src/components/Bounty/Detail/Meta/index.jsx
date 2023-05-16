import styled from "styled-components";

import { Card, Divider, noop } from "@osn/common-ui";
import Title from "./Title";
import Info from "./Info";
import Description from "./Description";
import Share from "./Share";
// import JoinGroupButton from "./JoinGroupButton";
import {
  descriptionLoading,
  metaLoading,
} from "@/components/Bounty/styled/metaLoading";
import Action from "./Action";
import { Group } from "../../../Common/Detail/styled";

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function BountyMeta({ bountyDetail, type, onEdit = noop }) {
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
      <Description bountyDetail={bountyDetail} onEdit={onEdit} />
      <Divider />
      <Group>
        <BottomBar>
          <Share />
          {/* <JoinGroupButton /> */}
        </BottomBar>
      </Group>
      <Action bountyDetail={bountyDetail} />
    </Card>
  );
}
