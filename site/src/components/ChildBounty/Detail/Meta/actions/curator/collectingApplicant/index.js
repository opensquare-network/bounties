import { ButtonGroup, ButtonText } from "../../styled";
import { Button, Flex } from "@osn/common-ui";

export function useCollectingApplicantAction() {
  // FIXME: collecting applicant action delete
  // sign
  function handleDelete() {}

  return (
    <ButtonGroup>
      <Flex>
        <Button disabled primary block>
          <ButtonText>Collecting Applications</ButtonText>
        </Button>

        <Button onClick={handleDelete}>Delete</Button>
      </Flex>
    </ButtonGroup>
  );
}
