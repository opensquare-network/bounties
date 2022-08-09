import { useDispatch, useSelector } from "react-redux";
import { Button, Flex } from "@osn/common-ui";
import { accountSelector } from "store/reducers/accountSlice";
import { useApi } from "utils/hooks";
import serverApi from "services/serverApi";
import {
  newErrorToast,
  newPendingToast,
  newSuccessToast,
  newToastId,
  removeToast,
} from "store/reducers/toastSlice";
import { signApiData } from "utils/signature";
import { ButtonGroup, ButtonText } from "../../styled";
import { encodeNetworkAddress, useIsMounted } from "@osn/common/src";
import { useFetchChildBountyDetail } from "hooks/useFetchChildBountyDetail";

export function useCuratorClosedChildBountyAction(childBountyDetail) {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const api = useApi();
  const isMounted = useIsMounted();
  const { fetchChildBountyDetail } = useFetchChildBountyDetail();

  const { parentBountyIndex, index } = childBountyDetail ?? {};

  const signer = encodeNetworkAddress(account?.address, account?.network);

  const showErrorToast = (message) => {
    dispatch(newErrorToast(message));
  };

  async function handleReopen() {
    if (!account) {
      return showErrorToast("Please connect wallet");
    }

    if (!api) {
      return showErrorToast("Network not connected yet");
    }

    const toastId = newToastId();
    dispatch(newPendingToast(toastId, "Waiting for signing..."));

    try {
      const payload = await signApiData(
        {
          action: "reopenChildBounty",
          network: account.network,
          parentBountyIndex,
          index,
        },
        signer,
      );

      const { result, error } = await serverApi.patch(`/child-bounty`, payload);
      if (result) {
        dispatch(newSuccessToast("Re-opened"));

        if (isMounted.current) {
          dispatch(fetchChildBountyDetail());
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
        <Button disabled primary block>
          <ButtonText>Closed</ButtonText>
        </Button>

        <Button onClick={handleReopen}>Reopen</Button>
      </Flex>
    </ButtonGroup>
  );
}
