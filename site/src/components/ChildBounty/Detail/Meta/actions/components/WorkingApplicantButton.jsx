import { Button, Dot, FlexCenter, IdentityUser, Time } from "@osn/common-ui";
import { ButtonText, Gap } from "../styled";

/**
 * @description Read only button to display current working applicant status
 */
export default function WorkingApplicantButton({ workingApplicant = {} }) {
  return (
    <Button block primary disabled>
      <FlexCenter>
        <ButtonText>
          Assigned to
          <Gap />
          <IdentityUser
            address={workingApplicant?.address}
            network={workingApplicant?.bountyIndexer?.network}
          />
        </ButtonText>
        <Dot />
        <Time time={workingApplicant?.updatedAt} />
      </FlexCenter>
    </Button>
  );
}
