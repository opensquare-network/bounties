import { APPLICATION_STATUS } from "utils/constants";

/**
 * if an applicant's status is `assigned`, `started` or `submitted`
 */
export function findUnassignableApplicant(applicants = []) {
  return applicants.find((i) => {
    return [
      APPLICATION_STATUS.Assigned,
      APPLICATION_STATUS.Started,
      APPLICATION_STATUS.Submitted,
    ].includes(i.status);
  });
}
