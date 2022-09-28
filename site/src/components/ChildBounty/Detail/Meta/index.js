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
import { useDifferentNetworkNotice } from "hooks/useDifferentNetworkNotice";

export default function ChildBountyDetailMeta({
  childBountyDetail,
  type,
  onEdit,
}) {
  const action = useAction(childBountyDetail);
  const { isSameNetwork } = useDifferentNetworkNotice(
    childBountyDetail?.network,
    childBountyDetail?.childBounty?.curators,
  );

  if (!childBountyDetail) {
    return <Card head={metaLoading}>{descriptionLoading}</Card>;
  }

  return (
    <Card head={<Title type={type} childBountyDetail={childBountyDetail} />}>
      <Info childBountyDetail={childBountyDetail} />

      <Divider />

      <Description bountyDetail={childBountyDetail} onEdit={onEdit} />

      <Divider />

      <Group>
        <Share />
      </Group>

      {isSameNetwork && action}
    </Card>
  );
}
