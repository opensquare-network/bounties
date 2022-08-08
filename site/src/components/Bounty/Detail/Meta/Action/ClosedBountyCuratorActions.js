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
import { ButtonGroup } from "../../../../Common/Detail/styled";
import { encodeNetworkAddress, useIsMounted } from "@osn/common/src";

export default function ClosedBountyCuratorActions({
  bountyDetail,
  reloadData,
}) {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const api = useApi();
  const isMounted = useIsMounted();

  const { bountyIndex } = bountyDetail ?? {};

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
          reloadData && reloadData();
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
        <Button primary block onClick={handleClose}>
          Reopen
        </Button>
      </Flex>
    </ButtonGroup>
  );
}
