import { useDispatch, useSelector } from "react-redux";
import { Button, Flex, noop, notification } from "@osn/common-ui";
import { accountSelector } from "store/reducers/accountSlice";
import serverApi from "services/serverApi";
import { signApiData } from "utils/signature";
import { ButtonGroup } from "../../../../Common/Detail/styled";
import { encodeNetworkAddress, useIsMounted } from "@osn/common";
import { CHILD_BOUNTY_STATUS } from "utils/constants";
import { useFetchBountyDetail } from "hooks/useFetchBountyDetail";
import { ButtonText } from "components/ChildBounty/Detail/Meta/actions/styled";
import { useIsCurator } from "hooks/useIsCurator";

export default function OpenBountyCuratorActions({ bountyDetail }) {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const isMounted = useIsMounted();
  const { fetchBountyDetail } = useFetchBountyDetail();

  const { bountyIndex, childBounties, bounty } = bountyDetail ?? {};

  const isCurator = useIsCurator(bounty?.curators);
  const isDifferentNetwork = account?.network !== bountyDetail?.network;

  const hasIncompleteChildBounties = childBounties
    ?.map((cb) => cb.status)
    .some((status) =>
      [CHILD_BOUNTY_STATUS.Open, CHILD_BOUNTY_STATUS.Assigned].includes(status),
    );

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
      timeout: false,
    });

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
        notification.success({
          message: "Closed",
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
      if (e.message === "Cancelled") {
        notification.warning({
          message: `Cancelled`,
        });
        return;
      }

      notification.error({
        message: `Failed to close. ${e.message}`,
      });
    } finally {
      closePendingNotification();
    }
  }

  return (
    <ButtonGroup>
      <Flex>
        {hasIncompleteChildBounties ? (
          <Button block primary disabled>
            <ButtonText>In Progress</ButtonText>
          </Button>
        ) : (
          isCurator && (
            <Button primary block onClick={handleClose} disabled={isDifferentNetwork}>
              Close
            </Button>
          )
        )}
      </Flex>
    </ButtonGroup>
  );
}
