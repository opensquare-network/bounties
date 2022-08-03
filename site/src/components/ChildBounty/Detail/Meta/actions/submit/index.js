import {
  ButtonGroup,
  ModalTitle,
  ModalDescription,
  FormLabel,
  FormLabelTip,
} from "../styled";
import { Button, Modal, RichEditor, Input, Flex } from "@osn/common-ui";
import { useState } from "react";

export function useSubmitAction() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const toggle = () => setOpen((v) => !v);

  function validateForm() {
    if (!content) {
      setErrorMsg("Description can not empty!");
      return false;
    }

    setErrorMsg("");
    return true;
  }
  function handleSubmit() {
    const validated = validateForm();
    if (validated) {
      // FIXME: submit action submit
    }
  }
  // FIXME: submit action cancel
  function handleCancel() {}

  return (
    <>
      <ButtonGroup>
        <Flex>
          <Button block primary onClick={toggle}>
            Submit Work
          </Button>

          <Button onClick={handleCancel}>Cancel</Button>
        </Flex>
      </ButtonGroup>

      <Modal
        open={open}
        setOpen={setOpen}
        okText="Confirm"
        onOk={handleSubmit}
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
          Link <FormLabelTip>Optional</FormLabelTip>
        </FormLabel>
        <Input placeholder="Please text here..." />
      </Modal>
    </>
  );
}
