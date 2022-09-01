import AwardedApplicantButton from "./components/AwardedApplicantButton";
import { findAwardedApplicant } from "./utils";

export function useAwardedAction(childBountyDetail) {
  const { applicants = [] } = childBountyDetail ?? {};
  const awardedApplicant = findAwardedApplicant(applicants);

  return (
    awardedApplicant && (
      <AwardedApplicantButton awardedApplicant={awardedApplicant} />
    )
  );
}
