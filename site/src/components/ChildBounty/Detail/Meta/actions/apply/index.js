import { Button, RichEditor, Modal } from "@osn/common-ui";
// TODO: expose Modal from ui
import { useState } from "react";
import { Title, Description, SubTitle } from "./styled";

export function useApplyAction() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    <>
      <Button block onClick={toggle}>
        Apply
      </Button>

      <Modal open={open} setOpen={setOpen} footer={false} width={640}>
        <Title>Apply Bounty</Title>
        <Description>
          Provide an action work plan and any initial questions you have for
          this bounty.
        </Description>

        <SubTitle>Work Plan</SubTitle>
        <RichEditor submitButtonText="Confirm"></RichEditor>
      </Modal>
    </>
  );
}
