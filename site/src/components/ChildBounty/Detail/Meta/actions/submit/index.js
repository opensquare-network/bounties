import { ButtonGroup } from "../styled";
import { Button, Flex } from "@osn/common-ui";
import { useSubmitModal } from "./useSubmitModal";

export function useSubmitAction() {
  const { toggle, modal } = useSubmitModal({
    // FIXME: submit action submit
    onConfirm(v) {
      const { content, link } = v;
    },
  });

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

      {modal}
    </>
  );
}
