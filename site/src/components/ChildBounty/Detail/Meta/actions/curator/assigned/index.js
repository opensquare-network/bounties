import { useDispatch, useSelector } from "react-redux";
import { Button, Flex } from "@osn/common-ui";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { ButtonGroup } from "../../styled";
import { findWorkingApplicant } from "../../utils";
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
import { useFetchChildBountyDetail } from "hooks/useFetchChildBountyDetail";

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
          dispatch(fetchChildBountyDetail());
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
