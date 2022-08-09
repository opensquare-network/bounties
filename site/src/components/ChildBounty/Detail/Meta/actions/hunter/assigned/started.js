import { Button, noop } from "@osn/common-ui";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { findStartedApplicant } from "../../utils";
import { useSubmitModal } from "./useSubmitModal";

export function useHunterStartedAction(childBountyDetail, reloadData = noop) {
  const { applications = [] } = childBountyDetail ?? {};
  const { submitWorkService } = useWorkflowActionService(
    childBountyDetail,
    reloadData,
  );

  const startedApplicant = findStartedApplicant(applications);

  const { modal, hide, show } = useSubmitModal({
    onConfirm(v) {
      const { content, link } = v;

      submitWorkService({
        applicant: startedApplicant,
        description: content,
        link,
      }).then(hide);
    },
  });

  return (
    <>
      {modal}

      <Button block primary onClick={show}>
        Submit Work
      </Button>
    </>
  );
}
