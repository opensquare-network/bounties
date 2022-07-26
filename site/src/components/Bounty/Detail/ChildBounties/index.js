import { useAsyncState } from "@osn/common";
import { Collapse, List, Button } from "@osn/common-ui";
import DetailLoader from "@osn/common-ui/es/Skeleton/DetailLoader";
import { useCallback } from "react";
import { useNavigate } from "react-router";

export default function ChildBounties({ bountyDetail = {} }) {
  const navigate = useNavigate();

  const goImportChild = useCallback(() => {
    navigate(
      `/import_child_bounty?network=${bountyDetail?.network}&parentBountyId=${bountyDetail?.bountyIndex}`,
    );
  }, [navigate, bountyDetail?.bountyIndex, bountyDetail?.network]);

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

      <Button block onClick={goImportChild}>
        Import a Child Bounty
      </Button>
    </Collapse>
  );
}
