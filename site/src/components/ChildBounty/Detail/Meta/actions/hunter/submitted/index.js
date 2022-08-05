import { ButtonGroup, ButtonText } from "../../styled";
import { Button, Flex, Dot, FlexCenter, Time } from "@osn/common-ui";
import { useSubmitModal } from "../submit/useSubmitModal";

// FIXME: submitted action has default content and link
export function useHunterSubmitedAction() {
  const { toggle, modal } = useSubmitModal({
    // FIXME: submitted action submit
    onConfirm(v) {
      // eslint-disable-next-line
      const { content, link } = v;
    },
  });

  // FIXME: submit action cancel
  function handleCancel() {}

  return (
    <>
      <ButtonGroup>
        <Flex>
          <Button block primary disabled>
            <FlexCenter>
              <ButtonText>Submitted</ButtonText>
              <Dot /> <Time time={new Date()} />
            </FlexCenter>
          </Button>

          <Button onClick={toggle}>Update</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Flex>
      </ButtonGroup>

      {modal}
    </>
  );
}
