import { ButtonGroup, ButtonText } from "../../styled";
import { Button, Flex } from "@osn/common-ui";

export function useCuratorCollectingApplicantAction() {
  // FIXME: collecting applicant action delete
  // sign
  function handleClose() {}

  return (
    <ButtonGroup>
      <Flex>
        <Button disabled primary block>
          <ButtonText>Collecting Applications</ButtonText>
        </Button>

        <Button onClick={handleClose}>Close</Button>
      </Flex>
    </ButtonGroup>
  );
}
