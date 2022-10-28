import { encodeNetworkAddress } from "@osn/common";
import {
  Button,
  RichEditor,
  Modal,
  Flex,
  Dot,
  Time,
  FlexCenter,
  FlexBetween,
} from "@osn/common-ui";
import { useIsActionLoading } from "context/ActionLoadingContext";
import { useAccount } from "hooks/useAccount";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { useMemo, useState } from "react";
import { APPLICATION_STATUS } from "utils/constants";
import {
  ModalTitle,
  ModalDescription,
  FormLabel,
  ButtonText,
  ButtonGroup,
  ApplyBountyEditorWrapper,
  FormLabelWrapper,
  FormLabelTip,
} from "../../styled";
import { useHunterCancelButton } from "../useCancelButton";

const contentMaxLength = 200;

export function useHunterOpenAction(childBountyDetail) {
  const { applications = [] } = childBountyDetail ?? {};
  const account = useAccount();

  const isDifferentNetwork = account?.network !== childBountyDetail?.network;

  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const toggleApplyModal = () => setOpen((v) => !v);
  const isContentOverflow = useMemo(
    () => content.length >= contentMaxLength,
    [content],
  );

  const { cancelButton } = useHunterCancelButton(childBountyDetail);

  const maybeHunterAddress = encodeNetworkAddress(
    account?.address,
    childBountyDetail?.network,
  );
  const appliedApplicant = applications.find(
    (i) =>
      i.address === maybeHunterAddress &&
      i.status !== APPLICATION_STATUS.Canceled,
  );

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

  const applyEl = (
    <>
      <Button
        block
        onClick={toggleApplyModal}
        disabled={isLoading || isDifferentNetwork}
      >
        Apply
      </Button>

      <Modal open={open} setOpen={setOpen} footer={false} width={640}>
        <ModalTitle>Apply Bounty</ModalTitle>
        <ModalDescription>
          Provide an action work plan and any initial questions you have for
          this bounty.
        </ModalDescription>

        <FormLabelWrapper>
          <FlexBetween>
            <FormLabel>Work Plan</FormLabel>
            <FormLabelTip error={isContentOverflow}>
              {content.length}/{contentMaxLength}
            </FormLabelTip>
          </FlexBetween>
        </FormLabelWrapper>
        <ApplyBountyEditorWrapper>
          <RichEditor
            content={content}
            setContent={(value) => {
              setContent(value.slice(0, contentMaxLength));
            }}
            submitButtonText="Confirm"
            onSubmit={handleApply}
            submitting={isLoading}
            submitButtonProps={{ disabled: true }}
          />
        </ApplyBountyEditorWrapper>
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
