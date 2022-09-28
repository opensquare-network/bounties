import { Collapse, Dot, FlexCenter, List, LoadingIcon } from "@osn/common-ui";
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
      <ListWrapper>
        <List
          gap={32}
          data={submissions}
          itemRender={(submission) => (
            <List.Item>
              <SubmissionItem {...submission} />
            </List.Item>
          )}
          noDataMessage="No current submissions"
          noDataProps={{ bordered: false, shadow: false }}
          loading={!childBountyDetail}
          loadingComponent={
            <FlexCenter>
              <LoadingIcon />
            </FlexCenter>
          }
        />
      </ListWrapper>
    </Collapse>
  );
}
