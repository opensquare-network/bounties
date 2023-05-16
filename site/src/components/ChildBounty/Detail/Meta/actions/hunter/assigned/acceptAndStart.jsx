import { Button } from "@osn/common-ui";
import { useIsActionLoading } from "context/ActionLoadingContext";
import { useAccount } from "hooks/useAccount";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { findAssignedApplicant } from "../../utils";

export function useHunterAcceptAndStart(childBountyDetail) {
  const { applications = [] } = childBountyDetail ?? {};
  const { acceptService } = useWorkflowActionService(childBountyDetail);
  const isLoading = useIsActionLoading();

  const account = useAccount();
  const isDifferentNetwork = account?.network !== childBountyDetail?.network;

  const assignedApplicant = findAssignedApplicant(applications);

  function handleAcceptAndStart() {
    acceptService({ applicant: assignedApplicant });
  }

  return (
    <Button primary block onClick={handleAcceptAndStart} disabled={isLoading || isDifferentNetwork}>
      Accept and Start
    </Button>
  );
}
