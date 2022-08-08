import { useDispatch, useSelector } from "react-redux";
import { Button, Flex } from "@osn/common-ui";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { ButtonGroup } from "../../styled";
import { findUnassignableApplicant } from "../../utils";
import { accountSelector } from "store/reducers/accountSlice";
import { useApi } from "utils/hooks";
import { awardChildBounty } from "services/chainApi";
import serverApi from "services/serverApi";
import {
  newErrorToast,
  newPendingToast,
  newSuccessToast,
  newToastId,
  removeToast,
  updatePendingToast,
} from "store/reducers/toastSlice";
import { encodeNetworkAddress, useIsMounted } from "@osn/common/src";
import { signApiData } from "utils/signature";

export function useCuratorAssignedAction(childBountyDetail, reloadData) {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const api = useApi();
  const isMounted = useIsMounted();

  const {
    parentBountyIndex,
    index,
    applications = [],
  } = childBountyDetail ?? {};

  const unassignedApplicant = findUnassignableApplicant(applications);
  const beneficiary = encodeNetworkAddress(
    unassignedApplicant?.address,
    account?.network,
  );
  const signer = encodeNetworkAddress(account?.address, account?.network);

  const { unassignService } = useWorkflowActionService(
    childBountyDetail,
    reloadData,
  );

  function handleUnassign() {
    unassignService({
      applicantAddress: unassignedApplicant.address,
      applicantNetwork: unassignedApplicant.bountyIndexer.network,
    });
  }

  const showErrorToast = (message) => {
    dispatch(newErrorToast(message));
  };

  const handleAward = async () => {
    if (!account) {
      return showErrorToast("Please connect wallet");
    }

    if (!api) {
      return showErrorToast("Network not connected yet");
    }

    const toastId = newToastId();
    dispatch(newPendingToast(toastId, "Waiting for signing..."));

    try {
      const childBountyMeta = await api.query.childBounties.childBounties(
        parentBountyIndex,
        index,
      );
      const meta = childBountyMeta?.toJSON();

      if (meta && meta.status?.active) {
        await awardChildBounty(
          api,
          parentBountyIndex,
          index,
          beneficiary,
          account,
          (status) => {
            dispatch(updatePendingToast(toastId, status));
          },
        );
      }

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
        dispatch(newSuccessToast("Awarded"));

        if (isMounted.current) {
          reloadData && reloadData();
        }
      }

      if (error) {
        dispatch(newErrorToast(error.message));
      }
    } catch (e) {
      dispatch(newErrorToast(`Failed to award. ${e.message}`));
    } finally {
      dispatch(removeToast(toastId));
    }
  };

  return (
    <ButtonGroup>
      <Flex>
        <Button primary block onClick={handleAward}>
          Award
        </Button>

        <Button onClick={handleUnassign}>Unassign</Button>
      </Flex>
    </ButtonGroup>
  );
}
