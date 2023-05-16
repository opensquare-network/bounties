import { encodeNetworkAddress } from "@osn/common";
import { Flex } from "@osn/common-ui";
import { useAccount } from "hooks/useAccount";
import { APPLICATION_STATUS } from "utils/constants";
import WorkingApplicantButton from "../../components/WorkingApplicantButton";
import { ButtonGroup } from "../../styled";
import { findWorkingApplicant } from "../../utils";
import { useHunterCancelButton } from "../useCancelButton";
import { useHunterAcceptAndStart } from "./acceptAndStart";
import { useHunterStartedAction } from "./started";
import { useHunterSubmittedAction } from "./submitted";

export function useHunterAssignedAction(childBountyDetail) {
  const { applications = [] } = childBountyDetail ?? {};
  const account = useAccount();
  const { cancelButton } = useHunterCancelButton(childBountyDetail);

  const workingApplicant = findWorkingApplicant(applications);

  const maybeHunterAddress = encodeNetworkAddress(account?.address, childBountyDetail?.network);
  const isMyWork = workingApplicant?.address === maybeHunterAddress;

  const acceptAndWork = useHunterAcceptAndStart(childBountyDetail);
  const started = useHunterStartedAction(childBountyDetail);
  const submitted = useHunterSubmittedAction(childBountyDetail);

  let actionEl = null;
  if (isMyWork) {
    if (workingApplicant?.status === APPLICATION_STATUS.Assigned) {
      actionEl = acceptAndWork;
    } else if (workingApplicant?.status === APPLICATION_STATUS.Started) {
      actionEl = started;
    } else if (workingApplicant?.status === APPLICATION_STATUS.Submitted) {
      actionEl = submitted;
    }
  }

  return (
    <ButtonGroup>
      <Flex>
        {isMyWork && workingApplicant ? (
          <>
            {actionEl}
            {cancelButton}
          </>
        ) : (
          <WorkingApplicantButton workingApplicant={workingApplicant} />
        )}
      </Flex>
    </ButtonGroup>
  );
}
