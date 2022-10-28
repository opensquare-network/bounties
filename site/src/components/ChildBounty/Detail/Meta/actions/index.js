import {
  CHILD_BOUNTY_CURATOR_VIEWS,
  CHILD_BOUNTY_STATUS,
} from "utils/constants";
import { useHunterOpenAction } from "./hunter/open";
import { useCuratorOpenAction } from "./curator/open";
import { useCuratorAssignedAction } from "./curator/assigned";
import { useHunterAssignedAction } from "./hunter/assigned";
import { useCuratorClosedChildBountyAction } from "./curator/closed";
import { useAwardedAction } from "./awarded";
import { useIsCurator } from "hooks/useIsCurator";
import { useSelector } from "react-redux";
import { childBountyDetailCuratorViewSelector } from "store/reducers/childBountyDetailSlice";
import { useMemo } from "react";

export function useAction(childBountyDetail) {
  const { status, childBounty } = childBountyDetail ?? {};
  const { curators = [] } = childBounty ?? {};

  const curatorView = useSelector(childBountyDetailCuratorViewSelector);

  const isCurator = useIsCurator(curators);
  const isCuratorView = useMemo(
    () => curatorView === CHILD_BOUNTY_CURATOR_VIEWS.CuratorView,
    [curatorView],
  );

  const hunterOpenAction = useHunterOpenAction(childBountyDetail);
  const hunterAssignedAction = useHunterAssignedAction(childBountyDetail);
  const curatorOpenAction = useCuratorOpenAction(childBountyDetail);
  const curatorAssignedAction = useCuratorAssignedAction(childBountyDetail);
  const curatorClosedChildBountyAction =
    useCuratorClosedChildBountyAction(childBountyDetail);
  const awardedAction = useAwardedAction(childBountyDetail);

  let actions = null;

  // curator view
  if (isCurator && isCuratorView) {
    if (status === CHILD_BOUNTY_STATUS.Open) {
      actions = curatorOpenAction;
    } else if (status === CHILD_BOUNTY_STATUS.Assigned) {
      actions = curatorAssignedAction;
    } else if (status === CHILD_BOUNTY_STATUS.Closed) {
      actions = curatorClosedChildBountyAction;
    }
  }
  // hunter view
  else {
    if (status === CHILD_BOUNTY_STATUS.Open) {
      actions = hunterOpenAction;
    } else if (status === CHILD_BOUNTY_STATUS.Assigned) {
      actions = hunterAssignedAction;
    }
  }

  // curator, hunter both view
  if (status === CHILD_BOUNTY_STATUS.Awarded) {
    actions = awardedAction;
  }

  return actions;
}
