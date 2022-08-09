import {
  Button,
  RichEditor,
  Modal,
  Flex,
  Dot,
  Time,
  FlexCenter,
} from "@osn/common-ui";
import { useAccount } from "hooks/useAccount";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { useState } from "react";
import { APPLICATION_STATUS } from "utils/constants";
import {
  ModalTitle,
  ModalDescription,
  FormLabel,
  ButtonText,
  ButtonGroup,
} from "../../styled";
import { useHunterCancelButton } from "../useCancelButton";

export function useHunterOpenAction(childBountyDetail, reloadData) {
  const { applications = [] } = childBountyDetail ?? {};
  const account = useAccount();

  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const toggleApplyModal = () => setOpen((v) => !v);

  const { cancelButton } = useHunterCancelButton(childBountyDetail, reloadData);

  const appliedApplicant = applications.find(
    (i) =>
      i.address === account?.encodedAddress &&
      i.status !== APPLICATION_STATUS.Canceled,
  );

  const { applyService } = useWorkflowActionService(
    childBountyDetail,
    reloadData,
  );

  function handleApply() {
    applyService({ description: content });
  }

  const applyEl = (
    <>
      <Button block onClick={toggleApplyModal}>
        Apply
      </Button>

      <Modal open={open} setOpen={setOpen} footer={false} width={640}>
        <ModalTitle>Apply Bounty</ModalTitle>
        <ModalDescription>
          Provide an action work plan and any initial questions you have for
          this bounty.
        </ModalDescription>

        <FormLabel>Work Plan</FormLabel>
        <RichEditor
          content={content}
          setContent={setContent}
          submitButtonText="Confirm"
          onSubmit={handleApply}
        />
      </Modal>
    </>
  );

  const isAppliedEl = (
    <ButtonGroup>
      <Flex>
        <Button block primary disabled>
          <FlexCenter>
            <ButtonText>Applied</ButtonText>
            <Dot />
            <Time time={appliedApplicant?.updatedAt} />
          </FlexCenter>
        </Button>

        {cancelButton}
      </Flex>
    </ButtonGroup>
  );

  return appliedApplicant ? isAppliedEl : applyEl;
}
