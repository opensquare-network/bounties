import { MarkdownPreviewer } from "@osn/previewer";
import { Collapse } from "@osn/common-ui";
import More from "components/Common/Detail/More";

export default function Description({ bountyDetail, onEdit }) {
  return (
    <Collapse title="Description" ghost>
      <MarkdownPreviewer content={bountyDetail.content} />
      <More onEditClick={onEdit} />
    </Collapse>
  );
}
