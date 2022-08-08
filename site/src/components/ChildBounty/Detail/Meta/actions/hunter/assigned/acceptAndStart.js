import { noop, Button } from "@osn/common-ui";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { findAssignedApplicant } from "../../utils";

export function useHunterAcceptAndStart(childBountyDetail, reloadData = noop) {
  const { applications = [] } = childBountyDetail ?? {};
  const { acceptService } = useWorkflowActionService(
    childBountyDetail,
    reloadData,
  );

  const assignedApplicant = findAssignedApplicant(applications);

  function handleAcceptAndStart() {
    acceptService({
      applicantAddress: assignedApplicant.address,
      applicantNetwork: assignedApplicant.bountyIndexer.network,
    });
  }

  return (
    <Button primary block onClick={handleAcceptAndStart}>
      Accept and Start
    </Button>
  );
}
