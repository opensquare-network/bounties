import { useAsyncState } from "@osn/common";
import { Collapse, List, Button } from "@osn/common-ui";
import DetailLoader from "@osn/common-ui/es/Skeleton/DetailLoader";

export default function ChildBounties({ bountyDetail = {} }) {
  const { state, isLoading } = useAsyncState(
    () => [],
    {},
    {
      onError: console.error,
    },
  );

  return (
    <Collapse title="Child Bounties">
      <List
        data={state}
        gap={20}
        noDataMessage="No current bounties"
        noDataProps={{ bordered: false, shadow: false }}
        isLoading={isLoading}
        loadingComponent={<DetailLoader />}
        renderItem={(item) => <List.Item></List.Item>}
      />

      <Button block>Import a Child Bounty</Button>
    </Collapse>
  );
}
