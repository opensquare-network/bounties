import { ButtonText } from "../../styled";
import { Button, Dot, FlexCenter, Time } from "@osn/common-ui";
import { useSubmitModal } from "./useSubmitModal";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { findSubmittedApplicant } from "../../utils";
import { useAccount } from "hooks/useAccount";

export function useHunterSubmittedAction(childBountyDetail) {
  const { applications = [] } = childBountyDetail ?? {};
  const { submitWorkService } = useWorkflowActionService(childBountyDetail);

  const account = useAccount();
  const isDifferentNetwork = account?.network !== childBountyDetail?.network;

  const submittedApplicant = findSubmittedApplicant(applications);

  const { show, hide, modal } = useSubmitModal({
    onConfirm(v) {
      const { content, link } = v;

      submitWorkService({
        applicant: submittedApplicant,
        description: content,
        link,
      }).then(hide);
    },
  });

  return (
    <>
      {modal}

      <Button block primary disabled>
        <FlexCenter>
          <ButtonText>Submitted</ButtonText>
          <Dot /> <Time time={submittedApplicant?.updatedAt} />
        </FlexCenter>
      </Button>

      <Button onClick={show} disabled={isDifferentNetwork}>Update</Button>
    </>
  );
}
