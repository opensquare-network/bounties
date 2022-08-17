import { Card, Divider, List } from "@osn/common-ui";

export default function ChildBountyDetailSubmission({ childBountyDetail }) {
  const { submissions = [] } = childBountyDetail ?? {};

  return (
    <div>
      <Card.Head title={<>Submission</>} />

      <Divider />

      <List
        noDataMessage="No current submission"
        noDataProps={{ bordered: false, shadow: false }}
        itemRender={(submission) => <List.Item>{submission}</List.Item>}
      />
    </div>
  );
}
