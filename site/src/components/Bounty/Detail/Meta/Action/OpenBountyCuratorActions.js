import { useDispatch, useSelector } from "react-redux";
import { Button, Flex } from "@osn/common-ui";
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
import { CHILD_BOUNTY_STATUS } from "utils/constants";
import { useFetchBountyDetail } from "hooks/useFetchBountyDetail";

export default function OpenBountyCuratorActions({ bountyDetail }) {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const isMounted = useIsMounted();
  const { fetchBountyDetail } = useFetchBountyDetail();

  const { bountyIndex, childBounties } = bountyDetail ?? {};

  const hasIncompleteChildBounties = childBounties
    ?.map((cb) => cb.status)
    .some((status) =>
      [CHILD_BOUNTY_STATUS.Open, CHILD_BOUNTY_STATUS.Assigned].includes(status),
    );

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
          action: "closeBounty",
          network: account.network,
          bountyIndex,
        },
        signer,
      );

      const { result, error } = await serverApi.patch(`/bounty`, payload);
      if (result) {
        dispatch(newSuccessToast("Closed"));

        if (isMounted.current) {
          dispatch(fetchBountyDetail());
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
        {!hasIncompleteChildBounties && (
          <Button primary block onClick={handleClose}>
            Close
          </Button>
        )}
      </Flex>
    </ButtonGroup>
  );
}
