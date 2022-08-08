import { Button, noop } from "@osn/common-ui";
import { useSubmitModal } from "./useSubmitModal";

export function useHunterStartedAction(childBountyDetail, reloadData = noop) {
  const { toggle, modal } = useSubmitModal({
    // FIXME: submit action submit
    onConfirm(v) {
      // eslint-disable-next-line
      const { content, link } = v;
    },
  });

  return (
    <>
      <Button block primary onClick={toggle}>
        Submit Work
      </Button>

      {modal}
    </>
  );
}
