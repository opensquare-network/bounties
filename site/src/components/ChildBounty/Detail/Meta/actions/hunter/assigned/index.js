import { Flex } from "@osn/common-ui";
import { useAccount } from "hooks/useAccount";
import { APPLICATION_STATUS } from "utils/constants";
import AssignedToButton from "../../components/AssignedToButton";
import { ButtonGroup } from "../../styled";
import { findUnassignableApplicant } from "../../utils";
import { useHunterCancelButton } from "../useCancelButton";
import { useHunterAcceptAndStart } from "./acceptAndStart";
import { useHunterStartedAction } from "./started";
import { useHunterSubmittedAction } from "./submitted";

export function useHunterAssignedAction(childBountyDetail) {
  const { applications = [] } = childBountyDetail ?? {};
  const account = useAccount();
  const { cancelButton } = useHunterCancelButton(childBountyDetail);

  const myApplicantInfo = applications.find(
    (i) => i.address === account?.encodedAddress,
  );

  const acceptAndWork = useHunterAcceptAndStart(childBountyDetail);
  const started = useHunterStartedAction(childBountyDetail);
  const submitted = useHunterSubmittedAction(childBountyDetail);

  const unassignedApplicant = findUnassignableApplicant(applications);

  let actionEl = null;
  if (myApplicantInfo?.status === APPLICATION_STATUS.Assigned) {
    actionEl = acceptAndWork;
  } else if (myApplicantInfo?.status === APPLICATION_STATUS.Started) {
    actionEl = started;
  } else if (myApplicantInfo?.status === APPLICATION_STATUS.Submitted) {
    actionEl = submitted;
  }

  return (
    <ButtonGroup>
      <Flex>
        {myApplicantInfo ? (
          <>
            {actionEl}
            {cancelButton}
          </>
        ) : (
          <AssignedToButton assignedApplicant={unassignedApplicant} />
        )}
      </Flex>
    </ButtonGroup>
  );
}
