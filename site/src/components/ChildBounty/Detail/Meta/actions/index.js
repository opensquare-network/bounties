import { CHILD_BOUNTY_STATUS } from "utils/constants";
import { useApplyAction } from "./apply";

export function useAction(childBountyDetail) {
  const { status } = childBountyDetail ?? {};
  const applyAction = useApplyAction();

  if (status === CHILD_BOUNTY_STATUS.Open) {
    return applyAction;
  } else if (status === CHILD_BOUNTY_STATUS.Apply) {
    return;
  }

  return null;
}
