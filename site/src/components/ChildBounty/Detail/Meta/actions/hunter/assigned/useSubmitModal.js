import { useEffect, useState } from "react";
import { Modal, RichEditor, Input, noop, FlexBetween } from "@osn/common-ui";
import {
  ModalTitle,
  ModalDescription,
  FormLabel,
  FormLabelTip,
} from "../../styled";
import { useIsActionLoading } from "context/ActionLoadingContext";

export function useSubmitModal(options) {
  const { onConfirm = noop } = options ?? {};

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [link, setLink] = useState("");
  const isLoading = useIsActionLoading();

  const hide = () => setOpen(false);
  const show = () => setOpen(true);

  function validateForm() {
    if (!content) {
      setErrorMsg("Description can not empty!");
      return false;
    }

    setErrorMsg("");
    return true;
  }

  useEffect(() => setErrorMsg(""), [open]);

  function handleSubmit() {
    const validated = validateForm();
    if (validated) {
      onConfirm({ content, link });
    }
  }

  const modal = (
    <Modal
      open={open}
      setOpen={setOpen}
      okText="Confirm"
      onOk={handleSubmit}
      disableButton={isLoading}
      width={640}
    >
      <ModalTitle>Submit Work</ModalTitle>
      <ModalDescription>
        Submit your work, and make sure all of the required work is done.
      </ModalDescription>

      <FormLabel>Description</FormLabel>
      <RichEditor
        content={content}
        setContent={setContent}
        showButtons={false}
        errorMsg={errorMsg}
      />

      <FormLabel>
        <FlexBetween>
          <span>Link</span>
          <FormLabelTip>Optional</FormLabelTip>
        </FlexBetween>
      </FormLabel>
      <Input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Please text here..."
      />
    </Modal>
  );

  return {
    modal,
    hide,
    show,
  };
}
