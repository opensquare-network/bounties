import { Flex, Button } from "@osn/common-ui";
import { useAccount } from "hooks/useAccount";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import AssignedToButton from "../../components/AssignedToButton";
import { ButtonGroup } from "../../styled";
import { findAssignedApplicant } from "../../utils";
import { useHunterCancelButton } from "../useCancelButton";

export function useHunterAssignedAction(childBountyDetail) {
  const { applications = [] } = childBountyDetail ?? {};
  const account = useAccount();
  const { cancelButton } = useHunterCancelButton();
  const { acceptService } = useWorkflowActionService(childBountyDetail);

  const assignedApplicant = findAssignedApplicant(applications);

  const isAssignedToMe = account?.encodedAddress === assignedApplicant?.address;

  function handleAcceptAndStart() {
    acceptService({
      applicantAddress: assignedApplicant.address,
      applicantNetwork: assignedApplicant.bountyIndexer.network,
    });
  }

  const acceptAndStartEl = (
    <>
      <Button primary block onClick={handleAcceptAndStart}>
        Accept and Start
      </Button>

      {cancelButton}
    </>
  );

  return (
    <ButtonGroup>
      <Flex>
        {isAssignedToMe ? (
          acceptAndStartEl
        ) : (
          <AssignedToButton assignedApplicant={assignedApplicant} />
        )}
      </Flex>
    </ButtonGroup>
  );
}
