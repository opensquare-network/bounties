import { MarkdownPreviewer } from "@osn/previewer";
import { Collapse } from "@osn/common-ui";
import More from "@/components/Common/Detail/More";
import { useBountyPermission } from "@/hooks/useBountyPermission";

export default function Description({ bountyDetail, onEdit }) {
  const { canEditBounty } = useBountyPermission(bountyDetail);

  return (
    <Collapse title="Description" ghost>
      <MarkdownPreviewer content={bountyDetail.content} />
      {canEditBounty && <More onEdit={onEdit} />}
    </Collapse>
  );
}
