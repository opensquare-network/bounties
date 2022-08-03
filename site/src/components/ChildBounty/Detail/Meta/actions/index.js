import { CHILD_BOUNTY_STATUS } from "utils/constants";
import { useApplyAction } from "./apply";
import { useSubmitAction } from "./submit";
import { useSubmitedAction } from "./submitted";

export function useAction(childBountyDetail) {
  const { status } = childBountyDetail ?? {};
  const applyAction = useApplyAction();
  const submitAction = useSubmitAction();
  const submittedAction = useSubmitedAction();

  // curator view
  // TODO: curator action

  // hunter view
  if (status === CHILD_BOUNTY_STATUS.Open) {
    return applyAction;
  } else if (status === CHILD_BOUNTY_STATUS.Apply) {
    return;
  } else if (status === CHILD_BOUNTY_STATUS.Started) {
    return submitAction;
  } else if (status === CHILD_BOUNTY_STATUS.Submitted) {
    return submittedAction;
  }

  // WorkDone
  return null;
}
