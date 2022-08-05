import { Flex } from "@osn/common-ui";
import { useAccount } from "hooks/useAccount";
import AssignedToButton from "../../components/AssignedToButton";
import { ButtonGroup } from "../../styled";
import { findAssignedApplicant } from "../../utils";

export function useHunterAssignedAction(childBountyDetail) {
  const { applications = [] } = childBountyDetail ?? {};
  const account = useAccount();

  const assignedApplicant = findAssignedApplicant(applications);

  const isAssignedToMe = account?.address === assignedApplicant?.address;

  return (
    <ButtonGroup>
      <Flex>
        <AssignedToButton assignedApplicant={assignedApplicant} />
      </Flex>
    </ButtonGroup>
  );
}
