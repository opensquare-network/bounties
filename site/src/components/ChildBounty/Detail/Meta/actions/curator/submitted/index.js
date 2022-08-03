import { ButtonGroup } from "../../styled";
import { Button, Flex } from "@osn/common-ui";

export function useCuratorSubmittedAction() {
  // FIXME: curator submitted action delete
  function handleDelete() {}

  return (
    <ButtonGroup>
      <Flex>
        <Button primary block>
          Award
        </Button>

        <Button onClick={handleDelete}>Delete</Button>
      </Flex>
    </ButtonGroup>
  );
}
