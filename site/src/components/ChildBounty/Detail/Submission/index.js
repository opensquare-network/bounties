import { Card, Divider, Dot, List } from "@osn/common-ui";
import { Count } from "./styled";
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
        <List
          gap={20}
          data={submissions}
          itemRender={(submission) => (
            <List.Item>
              <SubmissionItem {...submission} />
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
