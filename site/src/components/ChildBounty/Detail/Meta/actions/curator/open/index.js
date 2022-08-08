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

export function useCuratorOpenAction(childBountyDetail, reloadData) {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const api = useApi();
  const isMounted = useIsMounted();

  const { parentBountyIndex, index } = childBountyDetail ?? {};

  const signer = encodeNetworkAddress(account?.address, account?.network);

  const showErrorToast = (message) => {
    dispatch(newErrorToast(message));
  };

  async function handleClose() {
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
          action: "closeChildBounty",
          network: account.network,
          parentBountyIndex,
          index,
        },
        signer,
      );

      const { result, error } = await serverApi.patch(`/child-bounty`, payload);
      if (result) {
        dispatch(newSuccessToast("Closed"));

        if (isMounted.current) {
          reloadData && reloadData();
        }
      }

      if (error) {
        dispatch(newErrorToast(error.message));
      }
    } catch (e) {
      dispatch(newErrorToast(`Failed to close. ${e.message}`));
    } finally {
      dispatch(removeToast(toastId));
    }
  }

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
