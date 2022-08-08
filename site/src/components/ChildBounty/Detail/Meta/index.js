import { Card, Divider } from "@osn/common-ui";
import Description from "components/Bounty/Detail/Meta/Description";
import Share from "components/Bounty/Detail/Meta/Share";
import Title from "./Title";
import {
  descriptionLoading,
  metaLoading,
} from "components/Bounty/styled/metaLoading";
import { useAction } from "./actions";
import Info from "./Info";
import { Group } from "../../../Common/Detail/styled";

export default function ChildBountyDetailMeta({
  childBountyDetail,
  type,
  reloadData,
}) {
  const action = useAction(childBountyDetail, reloadData);

  if (!childBountyDetail) {
    return <Card head={metaLoading}>{descriptionLoading}</Card>;
  }

  const { childBounty } = childBountyDetail ?? {};

  return (
    <Card
      head={
        <Title
          type={type}
          childBountyDetail={childBountyDetail}
        />
      }
    >
      <Info childBountyDetail={childBountyDetail} />

      <Divider />

      <Description bountyDetail={childBountyDetail} />

      <Divider />

      <Group>
        <Share />
      </Group>

      {action}
    </Card>
  );
}
