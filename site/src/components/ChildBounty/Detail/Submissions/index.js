import { Collapse, Dot, List } from "@osn/common-ui";
import { Count, ListWrapper } from "./styled";
import SubmissionItem from "./SubmissionItem";

export default function ChildBountyDetailSubmissions({ childBountyDetail }) {
  const { applications = [] } = childBountyDetail ?? {};
  const submissions = applications
    .filter((i) => i.submission)
    .map((i) => ({
      ...i.submission,
      address: i.address,
      network: i.bountyIndexer.network,
    }));

  if (!childBountyDetail) {
    return null;
  }

  return (
    <Collapse
      title={
        <>
          Submissions
          {!!submissions?.length && (
            <>
              <Dot />
              <Count>{submissions.length}</Count>
            </>
          )}
        </>
      }
    >
      {!!submissions?.length && (
        <ListWrapper>
          <List
            gap={32}
            data={submissions}
            itemRender={(submission) => (
              <List.Item>
                <SubmissionItem {...submission} />
              </List.Item>
            )}
          />
        </ListWrapper>
      )}
    </Collapse>
  );
}
