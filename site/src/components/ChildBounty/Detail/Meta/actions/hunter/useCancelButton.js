// TODO: implement
import { Button } from "@osn/common-ui";

export function useHunterCancelButton(childBountyDetail) {
  const {} = childBountyDetail ?? {};

  const cancelButton = <Button>Cancel</Button>;

  return {
    cancelButton,
  };
}
