import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dot,
  Flex,
  FlexCenter,
  noop,
  useNotification,
  Time,
} from "@osn/common-ui";
import { accountSelector } from "@/store/reducers/accountSlice";
import serverApi from "@/services/serverApi";
import { signApiData } from "@/utils/signature";
import { ButtonGroup } from "../../../../Common/Detail/styled";
import { encodeNetworkAddress, useIsMounted } from "@osn/common";
import { useFetchBountyDetail } from "@/hooks/useFetchBountyDetail";
import { ButtonText } from "@/components/ChildBounty/Detail/Meta/actions/styled";
import { useIsCurator } from "@/hooks/useIsCurator";
import { useState } from "react";
import { useHandleSigningError } from "@/hooks/useHandleSigningError";

export default function ClosedBountyCuratorActions({ bountyDetail }) {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const isMounted = useIsMounted();
  const { fetchBountyDetail } = useFetchBountyDetail();
  const [isLoading, setIsLoading] = useState(false);
  const notification = useNotification();
  const handleSigningError = useHandleSigningError();

  const { bountyIndex, bounty } = bountyDetail ?? {};

  const isCurator = useIsCurator(bounty?.curators);
  const isDifferentNetwork = account?.network !== bountyDetail?.network;

  const signer = encodeNetworkAddress(account?.address, account?.network);

  async function handleClose() {
    if (!account) {
      notification.error({
        message: "Please connect wallet",
      });
      return;
    }

    let closePendingNotification = noop;
    closePendingNotification = notification.pending({
      message: "Signing...",
    });

    setIsLoading(true);

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
        notification.success({
          message: "Re-opened",
        });

        if (isMounted.current) {
          dispatch(fetchBountyDetail());
        }
      }

      if (error) {
        notification.error({
          message: error.message,
        });
      }
    } catch (e) {
      handleSigningError(e, "Failed to re-open");
    } finally {
      closePendingNotification();
      setIsLoading(false);
    }
  }

  return (
    <ButtonGroup>
      <Flex>
        {isCurator ? (
          <Button
            primary
            block
            onClick={handleClose}
            disabled={isLoading || isDifferentNetwork}
          >
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
