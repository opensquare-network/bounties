import { useAccount } from "hooks/useAccount";
import { CHILD_BOUNTY_STATUS } from "utils/constants";
import { useHunterApplyAction } from "./hunter/apply";
import { useCuratorCollectingApplicantAction } from "./curator/collectingApplicant";
import { useHunterSubmitAction } from "./hunter/submit";
import { useHunterSubmitedAction } from "./hunter/submitted";
import { useCuratorSubmittedAction } from "./curator/submitted";
import { useCuratorWorkDoneAction } from "./curator/workDone";
import { useCuratorAssignedAction } from "./curator/assigned";
import { useHunterAssignedAction } from "./hunter/assigned";
import { useCuratorClosedChildBountyAction } from "./curator/closed";

export function useAction(childBountyDetail, reloadData) {
  const { status, childBounty } = childBountyDetail ?? {};
  const { curators = [] } = childBounty ?? {};
  const account = useAccount();

  const isCurator = curators.includes(account?.encodedAddress);

  const hunterApplyAction = useHunterApplyAction(childBountyDetail, reloadData);
  const hunterSubmitAction = useHunterSubmitAction();
  const hunterSubmittedAction = useHunterSubmitedAction();
  const hunterAssignedAction = useHunterAssignedAction(
    childBountyDetail,
    reloadData,
  );
  const curatorCollectingApplicantAction = useCuratorCollectingApplicantAction(
    childBountyDetail,
    reloadData,
  );
  const curatorSubmittedAction = useCuratorSubmittedAction();
  const curatorWorkDoneAction = useCuratorWorkDoneAction();
  const curatorAssignedAction = useCuratorAssignedAction(
    childBountyDetail,
    reloadData,
  );
  const curatorClosedChildBountyAction = useCuratorClosedChildBountyAction(
    childBountyDetail,
    reloadData,
  );

  // curator view
  if (isCurator) {
    if (status === CHILD_BOUNTY_STATUS.Open) {
      return curatorCollectingApplicantAction;
    } else if (status === CHILD_BOUNTY_STATUS.Assigned) {
      return curatorAssignedAction;
    } else if (status === CHILD_BOUNTY_STATUS.Started) {
      return curatorSubmittedAction;
    } else if (status === CHILD_BOUNTY_STATUS.WorkDone) {
      return curatorWorkDoneAction;
    } else if (status === CHILD_BOUNTY_STATUS.Closed) {
      return curatorClosedChildBountyAction;
    }
  }
  // hunter view
  else {
    if (status === CHILD_BOUNTY_STATUS.Open) {
      return hunterApplyAction;
    } else if (status === CHILD_BOUNTY_STATUS.Assigned) {
      return hunterAssignedAction;
    } else if (status === CHILD_BOUNTY_STATUS.Started) {
      return hunterSubmitAction;
    } else if (status === CHILD_BOUNTY_STATUS.Submitted) {
      return hunterSubmittedAction;
    }
  }

  // WorkDone
  return null;
}
