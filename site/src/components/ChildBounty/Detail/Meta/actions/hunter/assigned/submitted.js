import { ButtonText } from "../../styled";
import { Button, Dot, FlexCenter, Time } from "@osn/common-ui";
import { useSubmitModal } from "./useSubmitModal";

// FIXME: submitted action has default content and link
export function useHunterSubmittedAction() {
  const { toggle, modal } = useSubmitModal({
    // FIXME: submitted action submit
    onConfirm(v) {
      // eslint-disable-next-line
      const { content, link } = v;
    },
  });

  return (
    <>
      <Button block primary disabled>
        <FlexCenter>
          <ButtonText>Submitted</ButtonText>
          <Dot /> <Time time={new Date()} />
        </FlexCenter>
      </Button>

      <Button onClick={toggle}>Update</Button>

      {modal}
    </>
  );
}
