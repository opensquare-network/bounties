import { Card, Divider, Dot, List } from "@osn/common-ui";
import { Count, ListWrapper } from "./styled";
import SubmissionItem from "./SubmissionItem";

export default function ChildBountyDetailSubmission({ childBountyDetail }) {
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
    <div>
      <Card.Head
        title={
          <>
            Submission
            {!!submissions?.length && (
              <>
                <Dot />
                <Count>{submissions.length}</Count>
              </>
            )}
          </>
        }
      />

      <Divider />

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
    </div>
  );
}
