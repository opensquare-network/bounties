import { useDispatch, useSelector } from "react-redux";
import { Button, Flex, noop, notification } from "@osn/common-ui";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { ButtonGroup } from "../../styled";
import { findWorkingApplicant } from "../../utils";
import { accountSelector } from "store/reducers/accountSlice";
import { useApi } from "utils/hooks";
import { awardChildBounty } from "services/chainApi";
import serverApi from "services/serverApi";
import { encodeNetworkAddress, useIsMounted } from "@osn/common";
import { signApiData } from "utils/signature";
import { useFetchChildBountyDetail } from "hooks/useFetchChildBountyDetail";
import { handleSigningError } from "utils/exceptionHandle";

export function useCuratorAssignedAction(childBountyDetail) {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const api = useApi();
  const isMounted = useIsMounted();
  const { fetchChildBountyDetail } = useFetchChildBountyDetail();

  const {
    parentBountyIndex,
    index,
    applications = [],
  } = childBountyDetail ?? {};

  const isDifferentNetwork = account?.network !== childBountyDetail?.network;

  const workingApplicant = findWorkingApplicant(applications);
  const beneficiary = encodeNetworkAddress(
    workingApplicant?.address,
    account?.network,
  );
  const signer = encodeNetworkAddress(account?.address, account?.network);

  const { unassignService } = useWorkflowActionService(childBountyDetail);

  function handleUnassign() {
    unassignService({ applicant: workingApplicant });
  }

  const handleAward = async () => {
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

    try {
      const childBountyMeta = await api.query.childBounties.childBounties(
        parentBountyIndex,
        index,
      );
      const meta = childBountyMeta?.toJSON();

      if (!meta || !meta.status?.active) {
        notification.error({
          message: `The child bounty is not active anymore. ` +
            `If it was closed/awarded by other tools, the status will be automatically updated later.`,
        });
        return;
      }

      await awardChildBounty(
        api,
        parentBountyIndex,
        index,
        beneficiary,
        account,
        (status) => {
          closePendingNotification();
          closePendingNotification = notification.pending({
            message: status,
            timeout: false,
          });
        },
      );

      const payload = await signApiData(
        {
          action: "resolveChildBounty",
          network: account.network,
          parentBountyIndex,
          index,
        },
        signer,
      );

      const { result, error } = await serverApi.patch(`/child-bounty`, payload);
      if (result) {
        notification.success({
          message: "Awarded",
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
    }
  };

  return (
    <ButtonGroup>
      <Flex>
        <Button primary block onClick={handleAward} disabled={isDifferentNetwork}>
          Award
        </Button>

        <Button onClick={handleUnassign} disabled={isDifferentNetwork}>Unassign</Button>
      </Flex>
    </ButtonGroup>
  );
}
