import { APPLICATION_STATUS } from "utils/constants";

export function findAssignedApplicant(applicants = []) {
  return applicants.find((i) => i.status === APPLICATION_STATUS.Assigned);
}
