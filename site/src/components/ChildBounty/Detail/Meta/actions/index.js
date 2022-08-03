import { CHILD_BOUNTY_STATUS } from "utils/constants";
import { useApplyAction } from "./apply";
import { useSubmitAction } from "./submit";

export function useAction(childBountyDetail) {
  const { status } = childBountyDetail ?? {};
  const applyAction = useApplyAction();
  const submitAction = useSubmitAction();

  // curator view
  // TODO: curator action

  // hunter view
  if (status === CHILD_BOUNTY_STATUS.Open) {
    return applyAction;
  } else if (status === CHILD_BOUNTY_STATUS.Apply) {
    return;
  } else if (status === CHILD_BOUNTY_STATUS.Started) {
    return submitAction;
  }

  // WorkDone
  return null;
}
