import {
  Button,
  Dot,
  Flex,
  FlexCenter,
  IdentityUser,
  Time,
} from "@osn/common-ui";
import { ButtonGroup, ButtonText, Gap } from "../../styled";
import { findAssignedApplicant } from "../../utils";

export function useHunterAssignedAction(childBountyDetail) {
  const { applications = [] } = childBountyDetail ?? {};

  const assignedApplicant = findAssignedApplicant(applications);

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
      </Flex>
    </ButtonGroup>
  );
}
