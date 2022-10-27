import { useDispatch, useSelector } from "react-redux";
import { Button, Flex, noop, notification } from "@osn/common-ui";
import { accountSelector } from "store/reducers/accountSlice";
import { useApi } from "utils/hooks";
import serverApi from "services/serverApi";
import { signApiData } from "utils/signature";
import { ButtonGroup } from "../../styled";
import { encodeNetworkAddress, useIsMounted } from "@osn/common";
import { useFetchChildBountyDetail } from "hooks/useFetchChildBountyDetail";
import { handleSigningError } from "utils/exceptionHandle";
import { useIsActionLoading, useSetIsActionLoading } from "context/ActionLoadingContext";
import ApplyApplicationButton from "../../components/ApplyApplicationButton";
import styled from "styled-components";

const FlexGap = styled(Flex)`
  gap: 20px;
`;

export function useCuratorOpenAction(childBountyDetail) {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const api = useApi();
  const isMounted = useIsMounted();
  const { fetchChildBountyDetail } = useFetchChildBountyDetail();
  const isLoading = useIsActionLoading();
  const setIsLoading = useSetIsActionLoading();

  const { parentBountyIndex, index } = childBountyDetail ?? {};

  const signer = encodeNetworkAddress(account?.address, account?.network);

  const isDifferentNetwork = account?.network !== childBountyDetail?.network;

  async function handleClose() {
    if (!account) {
      notification.error({
        message: "Please connect wallet",
      });
      return;
    }

    if (!api) {
      notification.error({
        message: "Network not connected yet",
      });
      return;
    }

    let closePendingNotification = noop;
    closePendingNotification = notification.pending({
      message: "Signing...",
      timeout: false,
    });

    setIsLoading(true);

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
        notification.success({
          message: "Closed",
        });

        if (isMounted.current) {
          dispatch(fetchChildBountyDetail());
        }
      }

      if (error) {
        notification.error({
          message: error.message,
        });
      }
    } catch (e) {
      handleSigningError(e, "Failed to update");
    } finally {
      closePendingNotification();
      setIsLoading(false);
    }
  }

  return (
    <ButtonGroup>
      <FlexGap>
        <ApplyApplicationButton childBountyDetail={childBountyDetail} />
        <Button onClick={handleClose} disabled={isLoading || isDifferentNetwork}>Close</Button>
      </FlexGap>
    </ButtonGroup>
  );
}
