import AwardedApplicantButton from "./components/AwardedApplicantButton";
import { CHILD_BOUNTY_STATUS } from "@/utils/constants";

export function useAwardedAction(childBountyDetail) {
  const { applications = [], status, beneficiary } = childBountyDetail ?? {};
  const awardedApplication = applications.find(application => {
    const { address: applicant } = application;
    return applicant === beneficiary && status === CHILD_BOUNTY_STATUS.Awarded;
  })

  if (!awardedApplication) {
    return null;
  }

  return <AwardedApplicantButton awardedApplicant={awardedApplication} />;
}
