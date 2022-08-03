import { useApplyAction } from "./apply";

const ACTION_MAP = {
  apply: "applyChildBounty",
  applied: "",
  accept: "acceptAssignment",
  submit: "submitWork",
  submitted: "",
  award: "",
  done: "",
};

export function useAction(childBountyDetail) {
  const { data: { action } = {} } = childBountyDetail ?? {};
  const applyAction = useApplyAction();

  if (action === ACTION_MAP.apply) {
    return applyAction;
  }

  return null;
}
