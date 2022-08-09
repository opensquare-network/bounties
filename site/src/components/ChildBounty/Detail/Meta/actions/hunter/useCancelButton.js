import { Button } from "@osn/common-ui";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { findSubmittedApplicant } from "../utils";

export function useHunterCancelButton(childBountyDetail, reloadData) {
  const { applications = [] } = childBountyDetail ?? {};
  const { cancelService } = useWorkflowActionService(
    childBountyDetail,
    reloadData,
  );

  const submittedApplicant = findSubmittedApplicant(applications);

  function handleCancel() {
    cancelService({ applicant: submittedApplicant });
  }

  const cancelButton = <Button onClick={handleCancel}>Cancel</Button>;

  return {
    cancelButton,
  };
}
