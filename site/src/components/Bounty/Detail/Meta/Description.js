import { MarkdownPreviewer } from "@osn/previewer";
import { Collapse } from "@osn/common-ui";
import More from "components/Common/Detail/More";
import { useDifferentNetworkNotice } from "hooks/useDifferentNetworkNotice";
import { useIsCurator } from "hooks/useIsCurator";

export default function Description({ bountyDetail, onEdit }) {
  const { isSameNetwork } = useDifferentNetworkNotice(bountyDetail?.network);
  const isCurator = useIsCurator(
    // for bounty
    bountyDetail?.bounty?.curators,
    // for child bounty
    bountyDetail?.childBounty?.curators,
  );

  return (
    <Collapse title="Description" ghost>
      <MarkdownPreviewer content={bountyDetail.content} />
      {isSameNetwork && isCurator && <More onEdit={onEdit} />}
    </Collapse>
  );
}
