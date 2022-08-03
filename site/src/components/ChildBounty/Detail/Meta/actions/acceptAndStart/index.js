// TODO: uncompleted
import { Button } from "@osn/common-ui";
import { ButtonGroup } from "../styled";

export function useAcceptAndStart() {
  return (
    <ButtonGroup>
      <Button primary block>
        Accept and Start
      </Button>

      <Button>Cancel</Button>
    </ButtonGroup>
  );
}
