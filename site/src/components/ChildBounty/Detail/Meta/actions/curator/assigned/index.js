import {
  Button,
  Dot,
  Flex,
  FlexCenter,
  IdentityUser,
  Time,
} from "@osn/common-ui";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { ButtonGroup, ButtonText, Gap } from "../../styled";
import { findAssignedApplicant } from "../../utils";

export function useCuratorAssignedAction(childBountyDetail) {
  const { applications = [] } = childBountyDetail ?? {};

  const assignedApplicant = findAssignedApplicant(applications);

  const { unassignService } = useWorkflowActionService(childBountyDetail);

  function handleUnassign() {
    unassignService({ applicantAddress: assignedApplicant.address });
  }

  return (
    <ButtonGroup>
      <Flex>
        <Button block primary disabled>
          <FlexCenter>
            <ButtonText>
              Assigned to
              <Gap />
              <IdentityUser
                address={assignedApplicant?.address}
                network={assignedApplicant?.network}
              />
            </ButtonText>
            <Dot />
            <Time time={assignedApplicant?.updatedAt} />
          </FlexCenter>
        </Button>

        <Button onClick={handleUnassign}>Unassign</Button>
      </Flex>
    </ButtonGroup>
  );
}
