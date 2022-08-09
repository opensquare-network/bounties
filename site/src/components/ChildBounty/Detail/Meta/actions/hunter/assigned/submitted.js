import { ButtonText } from "../../styled";
import { Button, Dot, FlexCenter, noop, Time } from "@osn/common-ui";
import { useSubmitModal } from "./useSubmitModal";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { findSubmittedApplicant } from "../../utils";

export function useHunterSubmittedAction(childBountyDetail, reloadData = noop) {
  const { applications = [] } = childBountyDetail ?? {};
  const { submitWorkService } = useWorkflowActionService(
    childBountyDetail,
    reloadData,
  );

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

      <Button onClick={show}>Update</Button>
    </>
  );
}
