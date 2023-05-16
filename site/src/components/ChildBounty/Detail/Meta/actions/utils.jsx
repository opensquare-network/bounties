import { APPLICATION_STATUS } from "@/utils/constants";

/**
 * @description find a working applicant, status is `assigned`, `started` or `submitted`
 */
export function findWorkingApplicant(applicants = []) {
  return applicants.find((i) => {
    return [
      APPLICATION_STATUS.Assigned,
      APPLICATION_STATUS.Started,
      APPLICATION_STATUS.Submitted,
    ].includes(i.status);
  });
}

export function findAssignedApplicant(applicants = []) {
  return findApplicantByStatus(applicants, APPLICATION_STATUS.Assigned);
}

export function findStartedApplicant(applicants = []) {
  return findApplicantByStatus(applicants, APPLICATION_STATUS.Started);
}

export function findSubmittedApplicant(applicants = []) {
  return findApplicantByStatus(applicants, APPLICATION_STATUS.Submitted);
}

export function findAwardedApplicant(applicants = []) {
  return findApplicantByStatus(applicants, APPLICATION_STATUS.Awarded);
}

function findApplicantByStatus(applicants = [], status = "") {
  return applicants.find((i) => i.status === status);
}
