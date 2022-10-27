import {
  Button,
  RichEditor,
  Modal,
  Flex,
} from "@osn/common-ui";
import { useIsActionLoading } from "context/ActionLoadingContext";
import { useAccount } from "hooks/useAccount";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { useState } from "react";
import styled from "styled-components";
import {
  ModalTitle,
  ModalDescription,
  FormLabel,
} from "../styled";

const Wrapper = styled(Flex)`
  flex-grow: 1;
`;

export default function ApplyApplicationButton({ childBountyDetail }) {
  const account = useAccount();

  const isDifferentNetwork = account?.network !== childBountyDetail?.network;

  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const toggleApplyModal = () => setOpen((v) => !v);
  const { applyService } = useWorkflowActionService(childBountyDetail);
  const isLoading = useIsActionLoading();

  function handleApply() {
    applyService({ description: content }).then((res) => {
      if (!res || res.error) {
        return;
      }
      setOpen(false);
      setContent("");
    });
  }

  return (
    <Wrapper>
      <Button block onClick={toggleApplyModal} disabled={isLoading || isDifferentNetwork}>
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
          submitting={isLoading}
        />
      </Modal>
    </Wrapper>
  );
}
