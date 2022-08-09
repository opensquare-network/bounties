import { Button } from "@osn/common-ui";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { findAssignedApplicant } from "../../utils";

export function useHunterAcceptAndStart(childBountyDetail) {
  const { applications = [] } = childBountyDetail ?? {};
  const { acceptService } = useWorkflowActionService(childBountyDetail);

  const assignedApplicant = findAssignedApplicant(applications);

  function handleAcceptAndStart() {
    acceptService({ applicant: assignedApplicant });
  }

  return (
    <Button primary block onClick={handleAcceptAndStart}>
      Accept and Start
    </Button>
  );
}
