import { Button, RichEditor, Modal } from "@osn/common-ui";
import { useState } from "react";
import { ModalTitle, ModalDescription, FormLabel } from "../../styled";
import { useActionService } from "../../useActionService";

export function useHunterApplyAction(childBountyDetail) {
  const {} = childBountyDetail ?? {};

  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  const { apply } = useActionService(childBountyDetail);

  function handleSubmit() {
    apply({ content });
  }

  return (
    <>
      <Button block onClick={toggle}>
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
          onSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
}
