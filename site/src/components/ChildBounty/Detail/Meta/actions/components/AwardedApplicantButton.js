import {
  Button,
  Dot,
  FlexCenter,
  Gap,
  IdentityUser,
  Time,
} from "@osn/common-ui";
import { ButtonText } from "../styled";

export default function AwardedApplicantButton({ awardedApplicant }) {
  return (
    <Button block primary disabled>
      <FlexCenter>
        <ButtonText>
          Awarded to
          <Gap mx={4} />
          <IdentityUser
            address={awardedApplicant?.address}
            network={awardedApplicant?.bountyIndexer?.network}
          />
        </ButtonText>
        <Dot />
        <Time time={awardedApplicant?.updatedAt} />
      </FlexCenter>
    </Button>
  );
}
