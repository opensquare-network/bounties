import { ButtonGroup, ButtonText, Gap } from "../../styled";
import {
  Button,
  Dot,
  Flex,
  FlexCenter,
  IdentityUser,
  Time,
} from "@osn/common-ui";

export function useCuratorWorkDoneAction() {
  // FIXME: curator work done action real address and network
  const address = "5F9SEjJVdpiNDe2UcvEnLhCfvRCbVuGynvagSeBWFDwP4oLs";
  const network = "kusama";

  return (
    <ButtonGroup>
      <Flex>
        <Button disabled primary block>
          <FlexCenter>
            <ButtonText>
              <IdentityUser address={address} network={network} />
              <Gap />
              work done
            </ButtonText>
            <Dot />
            <Time time={new Date()} />
          </FlexCenter>
        </Button>

        <Button disabled>Delete</Button>
      </Flex>
    </ButtonGroup>
  );
}
