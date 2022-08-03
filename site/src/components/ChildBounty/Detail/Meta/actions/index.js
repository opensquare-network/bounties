import { useMemo } from "react";
import { useSelector } from "react-redux";
import { accountSelector } from "store/reducers/accountSlice";
import { CHILD_BOUNTY_STATUS } from "utils/constants";
import { useHunterApplyAction } from "./hunter/apply";
import { useCuratorCollectingApplicantAction } from "./curator/collectingApplicant";
import { useHunterSubmitAction } from "./hunter/submit";
import { useHunterSubmitedAction } from "./hunter/submitted";
import { useCuratorSubmittedAction } from "./curator/submitted";

export function useAction(childBountyDetail) {
  const { status, childBounty } = childBountyDetail ?? {};
  const { curators = [] } = childBounty ?? {};
  const account = useSelector(accountSelector);

  const isCurator = useMemo(
    () => curators.some((i) => i === account?.address),
    [account?.address, curators],
  );

  const hunterApplyAction = useHunterApplyAction();
  const hunterSubmitAction = useHunterSubmitAction();
  const hunterSubmittedAction = useHunterSubmitedAction();
  const curatorCollectingApplicantAction =
    useCuratorCollectingApplicantAction();
  const curatorSubmittedAction = useCuratorSubmittedAction();

  // curator view
  if (isCurator) {
    if (status === CHILD_BOUNTY_STATUS.Open) {
      return curatorCollectingApplicantAction;
    } else if (status === CHILD_BOUNTY_STATUS.Started) {
      return curatorSubmittedAction;
    }
  }
  // hunter view
  else {
    if (status === CHILD_BOUNTY_STATUS.Open) {
      return hunterApplyAction;
    } else if (status === CHILD_BOUNTY_STATUS.Apply) {
      return;
    } else if (status === CHILD_BOUNTY_STATUS.Started) {
      return hunterSubmitAction;
    } else if (status === CHILD_BOUNTY_STATUS.Submitted) {
      return hunterSubmittedAction;
    }
  }

  // WorkDone
  return null;
}
