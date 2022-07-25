import { MarkdownPreviewer } from "@osn/previewer";
import { Collapse } from "@osn/common-ui";

export default function Description({ bountyDetail }) {
  return (
    <Collapse title="Description" ghost>
      <MarkdownPreviewer content={bountyDetail.content} />
    </Collapse>
  );
}
