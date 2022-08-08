import { Flex, Button } from "@osn/common-ui";
import { useAccount } from "hooks/useAccount";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import AssignedToButton from "../../components/AssignedToButton";
import { ButtonGroup } from "../../styled";
import { findUnassignableApplicant } from "../../utils";
import { useHunterCancelButton } from "../useCancelButton";

export function useHunterAssignedAction(childBountyDetail, reloadData) {
  const { applications = [] } = childBountyDetail ?? {};
  const account = useAccount();
  const { cancelButton } = useHunterCancelButton();
  const { acceptService } = useWorkflowActionService(
    childBountyDetail,
    reloadData,
  );

  const unassignedApplicant = findUnassignableApplicant(applications);

  const isAssignedToMe =
    account?.encodedAddress === unassignedApplicant?.address;

  function handleAcceptAndStart() {
    acceptService({
      applicantAddress: unassignedApplicant.address,
      applicantNetwork: unassignedApplicant.bountyIndexer.network,
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
          <AssignedToButton assignedApplicant={unassignedApplicant} />
        )}
      </Flex>
    </ButtonGroup>
  );
}
