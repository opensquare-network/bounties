import { useDispatch, useSelector } from "react-redux";
import { Button, Dot, Flex, FlexCenter, Time } from "@osn/common-ui";
import { accountSelector } from "store/reducers/accountSlice";
import serverApi from "services/serverApi";
import {
  newErrorToast,
  newPendingToast,
  newSuccessToast,
  newToastId,
  removeToast,
} from "store/reducers/toastSlice";
import { signApiData } from "utils/signature";
import { ButtonGroup } from "../../../../Common/Detail/styled";
import { encodeNetworkAddress, useIsMounted } from "@osn/common/src";
import { useFetchBountyDetail } from "hooks/useFetchBountyDetail";
import { useIsCurator } from "hooks/useIsCurator";
import { ButtonText } from "components/ChildBounty/Detail/Meta/actions/styled";

export default function ClosedBountyCuratorActions({ bountyDetail }) {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const isMounted = useIsMounted();
  const { fetchBountyDetail } = useFetchBountyDetail();
  const isCurator = useIsCurator(bountyDetail?.bounty?.curators);

  const { bountyIndex } = bountyDetail ?? {};

  const signer = encodeNetworkAddress(account?.address, account?.network);

  const showErrorToast = (message) => {
    dispatch(newErrorToast(message));
  };

  async function handleClose() {
    if (!account) {
      return showErrorToast("Please connect wallet");
    }

    const toastId = newToastId();
    dispatch(newPendingToast(toastId, "Waiting for signing..."));

    try {
      const payload = await signApiData(
        {
          action: "reopenBounty",
          network: account.network,
          bountyIndex,
        },
        signer,
      );

      const { result, error } = await serverApi.patch(`/bounty`, payload);
      if (result) {
        dispatch(newSuccessToast("Re-opened"));

        if (isMounted.current) {
          dispatch(fetchBountyDetail());
        }
      }

      if (error) {
        dispatch(newErrorToast(error.message));
      }
    } catch (e) {
      dispatch(newErrorToast(`Failed to reopen. ${e.message}`));
    } finally {
      dispatch(removeToast(toastId));
    }
  }

  return (
    <ButtonGroup>
      <Flex>
        {isCurator ? (
          <Button primary block onClick={handleClose}>
            Reopen
          </Button>
        ) : (
          <Button primary block disabled>
            <FlexCenter>
              <ButtonText>Closed</ButtonText>
              <Dot />
              <Time time={bountyDetail?.updatedAt} />
            </FlexCenter>
          </Button>
        )}
      </Flex>
    </ButtonGroup>
  );
}
