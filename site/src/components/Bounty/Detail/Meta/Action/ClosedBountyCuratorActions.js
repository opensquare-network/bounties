import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dot,
  Flex,
  FlexCenter,
  noop,
  notification,
  Time,
} from "@osn/common-ui";
import { accountSelector } from "store/reducers/accountSlice";
import serverApi from "services/serverApi";
import { signApiData } from "utils/signature";
import { ButtonGroup } from "../../../../Common/Detail/styled";
import { encodeNetworkAddress, useIsMounted } from "@osn/common/es";
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
      notification.error({
        message: `Failed to re-open. ${e.message}`,
      });
    } finally {
      closePendingNotification();
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
