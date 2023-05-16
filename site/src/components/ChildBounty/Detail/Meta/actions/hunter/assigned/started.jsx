import { Button } from "@osn/common-ui";
import { useIsActionLoading } from "@/context/ActionLoadingContext";
import { useAccount } from "@/hooks/useAccount";
import { useWorkflowActionService } from "@/hooks/useWorkflowActionService";
import { findStartedApplicant } from "../../utils";
import { useSubmitModal } from "./useSubmitModal";

export function useHunterStartedAction(childBountyDetail) {
  const { applications = [] } = childBountyDetail ?? {};
  const { submitWorkService } = useWorkflowActionService(childBountyDetail);
  const isLoading = useIsActionLoading();

  const account = useAccount();
  const isDifferentNetwork = account?.network !== childBountyDetail?.network;

  const startedApplicant = findStartedApplicant(applications);

  const { modal, hide, show } = useSubmitModal({
    onConfirm(v) {
      const { content, link } = v;

      submitWorkService({
        applicant: startedApplicant,
        description: content,
        link,
      }).then((res) => {
        if (!res || res.error) {
          return;
        }
        hide();
      });
    },
  });

  return (
    <>
      {modal}

      <Button block primary onClick={show} disabled={isLoading || isDifferentNetwork}>
        Submit Work
      </Button>
    </>
  );
}
