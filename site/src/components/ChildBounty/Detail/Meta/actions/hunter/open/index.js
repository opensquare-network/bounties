import { encodeNetworkAddress } from "@osn/common";
import {
  Button,
  Flex,
  Dot,
  Time,
  FlexCenter,
} from "@osn/common-ui";
import { useAccount } from "hooks/useAccount";
import { APPLICATION_STATUS } from "utils/constants";
import ApplyApplicationButton from "../../components/ApplyApplicationButton";
import {
  ButtonText,
  ButtonGroup,
} from "../../styled";
import { useHunterCancelButton } from "../useCancelButton";

export function useHunterOpenAction(childBountyDetail) {
  const { applications = [] } = childBountyDetail ?? {};
  const account = useAccount();

  const { cancelButton } = useHunterCancelButton(childBountyDetail);

  const maybeHunterAddress = encodeNetworkAddress(account?.address, childBountyDetail?.network);
  const appliedApplicant = applications.find(
    (i) =>
      i.address === maybeHunterAddress &&
      i.status !== APPLICATION_STATUS.Canceled,
  );

  const applyEl = <ApplyApplicationButton childBountyDetail={childBountyDetail} />;

  const isAppliedEl = (
    <ButtonGroup>
      <Flex>
        <Button block primary disabled>
          <FlexCenter>
            <ButtonText>Applied</ButtonText>
            <Dot />
            <Time time={appliedApplicant?.updatedAt} />
          </FlexCenter>
        </Button>

        {cancelButton}
      </Flex>
    </ButtonGroup>
  );

  return appliedApplicant ? isAppliedEl : applyEl;
}
