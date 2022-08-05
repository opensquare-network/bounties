import { Button, Flex } from "@osn/common-ui";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import AssignedToButton from "../../components/AssignedToButton";
import { ButtonGroup } from "../../styled";
import { findAssignedApplicant } from "../../utils";

export function useCuratorAssignedAction(childBountyDetail) {
  const { applications = [] } = childBountyDetail ?? {};

  const assignedApplicant = findAssignedApplicant(applications);

  const { unassignService } = useWorkflowActionService(childBountyDetail);

  function handleUnassign() {
    unassignService({
      applicantAddress: assignedApplicant.address,
      applicantNetwork: assignedApplicant.bountyIndexer.network,
    });
  }

  return (
    <ButtonGroup>
      <Flex>
        <AssignedToButton assignedApplicant={assignedApplicant} />

        <Button onClick={handleUnassign}>Unassign</Button>
      </Flex>
    </ButtonGroup>
  );
}
