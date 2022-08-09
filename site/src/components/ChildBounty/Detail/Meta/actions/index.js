import { useAccount } from "hooks/useAccount";
import { CHILD_BOUNTY_STATUS } from "utils/constants";
import { useHunterOpenAction } from "./hunter/open";
import { useCuratorOpenAction } from "./curator/open";
import { useCuratorSubmittedAction } from "./curator/submitted";
import { useCuratorWorkDoneAction } from "./curator/workDone";
import { useCuratorAssignedAction } from "./curator/assigned";
import { useHunterAssignedAction } from "./hunter/assigned";
import { useCuratorClosedChildBountyAction } from "./curator/closed";

export function useAction(childBountyDetail) {
  const { status, childBounty } = childBountyDetail ?? {};
  const { curators = [] } = childBounty ?? {};
  const account = useAccount();

  const isCurator = curators.includes(account?.encodedAddress);

  const hunterOpenAction = useHunterOpenAction(childBountyDetail);
  const hunterAssignedAction = useHunterAssignedAction(childBountyDetail);
  const curatorOpenAction = useCuratorOpenAction(childBountyDetail);
  const curatorSubmittedAction = useCuratorSubmittedAction();
  const curatorWorkDoneAction = useCuratorWorkDoneAction();
  const curatorAssignedAction = useCuratorAssignedAction(childBountyDetail);
  const curatorClosedChildBountyAction =
    useCuratorClosedChildBountyAction(childBountyDetail);

  // curator view
  if (isCurator) {
    if (status === CHILD_BOUNTY_STATUS.Open) {
      return curatorOpenAction;
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
      return hunterOpenAction;
    } else if (status === CHILD_BOUNTY_STATUS.Assigned) {
      return hunterAssignedAction;
    }
  }

  // WorkDone
  return null;
}
