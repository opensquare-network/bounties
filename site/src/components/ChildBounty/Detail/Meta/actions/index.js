import { useApplyAction } from "./apply";

const ACTION_MAP = {
  apply: "importChildBounty",
};

export function useAction(childBountyDetail) {
  const { data: { action } = {} } = childBountyDetail ?? {};
  const applyAction = useApplyAction();

  if (action === ACTION_MAP.apply) {
    return applyAction;
  }

  return null;
}
