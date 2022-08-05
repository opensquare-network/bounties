import { Button, Dot, FlexCenter, IdentityUser, Time } from "@osn/common-ui";
import { ButtonText, Gap } from "../styled";

export default function AssignedToButton({ assignedApplicant = {} }) {
  return (
    <Button block primary disabled>
      <FlexCenter>
        <ButtonText>
          Assigned to
          <Gap />
          <IdentityUser
            address={assignedApplicant?.address}
            network={assignedApplicant?.bountyIndexer?.network}
          />
        </ButtonText>
        <Dot />
        <Time time={assignedApplicant?.updatedAt} />
      </FlexCenter>
    </Button>
  );
}
