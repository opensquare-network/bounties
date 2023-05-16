import { useDispatch, useSelector } from "react-redux";
import { Button, Flex, noop, useNotification } from "@osn/common-ui";
import { accountSelector } from "@/store/reducers/accountSlice";
import { useApi } from "@/utils/hooks";
import serverApi from "@/services/serverApi";
import { signApiData } from "@/utils/signature";
import { ButtonGroup, ButtonText } from "../../styled";
import { encodeNetworkAddress, useIsMounted } from "@osn/common";
import { useFetchChildBountyDetail } from "@/hooks/useFetchChildBountyDetail";
import {
  useIsActionLoading,
  useSetIsActionLoading,
} from "@/context/ActionLoadingContext";
import { useHandleSigningError } from "@/hooks/useHandleSigningError";

export function useCuratorOpenAction(childBountyDetail) {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const api = useApi();
  const isMounted = useIsMounted();
  const { fetchChildBountyDetail } = useFetchChildBountyDetail();
  const isLoading = useIsActionLoading();
  const setIsLoading = useSetIsActionLoading();
  const notification = useNotification();
  const handleSigningError = useHandleSigningError();

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
      <Flex>
        <Button disabled primary block>
          <ButtonText>Collecting Applications</ButtonText>
        </Button>

        <Button
          onClick={handleClose}
          disabled={isLoading || isDifferentNetwork}
        >
          Close
        </Button>
      </Flex>
    </ButtonGroup>
  );
}
