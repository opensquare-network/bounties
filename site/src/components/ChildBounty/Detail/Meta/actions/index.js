import { useMemo } from "react";
import { useSelector } from "react-redux";
import { accountSelector } from "store/reducers/accountSlice";
import { CHILD_BOUNTY_STATUS } from "utils/constants";
import { useApplyAction } from "./apply";
import { useSubmitAction } from "./submit";
import { useSubmitedAction } from "./submitted";

export function useAction(childBountyDetail) {
  const { status, childBounty } = childBountyDetail ?? {};
  const { curators = [] } = childBounty ?? {};
  const account = useSelector(accountSelector);

  const isCurator = useMemo(
    () => curators.some((i) => i === account?.address),
    [account?.address, curators],
  );

  const applyAction = useApplyAction();
  const submitAction = useSubmitAction();
  const submittedAction = useSubmitedAction();

  // curator view
  if (isCurator) {
  }
  // hunter view
  else {
    if (status === CHILD_BOUNTY_STATUS.Open) {
      return applyAction;
    } else if (status === CHILD_BOUNTY_STATUS.Apply) {
      return;
    } else if (status === CHILD_BOUNTY_STATUS.Started) {
      return submitAction;
    } else if (status === CHILD_BOUNTY_STATUS.Submitted) {
      return submittedAction;
    }
  }

  // WorkDone
  return null;
}
