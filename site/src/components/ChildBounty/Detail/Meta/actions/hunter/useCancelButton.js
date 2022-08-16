import { Button } from "@osn/common-ui";
import { useAccount } from "hooks/useAccount";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";

export function useHunterCancelButton(childBountyDetail) {
  const account = useAccount();
  const { applications = [] } = childBountyDetail ?? {};
  const { cancelService } = useWorkflowActionService(childBountyDetail);

  const applicant = applications.find(
    (i) => i.address === account?.encodedAddress,
  );

  function handleCancel() {
    cancelService({ applicant });
  }

  const cancelButton = <Button onClick={handleCancel}>Cancel</Button>;

  return {
    cancelButton,
  };
}
