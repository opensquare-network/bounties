import { encodeNetworkAddress } from "@osn/common/src";
import { useAccount } from "hooks/useAccount";
import serverApi from "services/serverApi";
import { signApiData } from "utils/signature";
import { useDispatch } from "react-redux";
import { newErrorToast } from "store/reducers/toastSlice";

export function useWorkflowActionService(childBountyDetail, reloadData) {
  const dispatch = useDispatch();
  const { network, parentBountyIndex, index } = childBountyDetail ?? {};
  const account = useAccount();

  const data = {
    network,
    parentBountyIndex,
    index,
  };

  const showErrorToast = (message) => {
    dispatch(newErrorToast(message));
  };

  async function service(endpoint, method, signedData) {
    try {
      const res = await serverApi[method](endpoint, signedData);

      if (res.result) {
        reloadData && reloadData();
      }

      if (res.error) {
        return showErrorToast(res.error.message);
      }

      return res;
    } catch (e) {
      console.error(e);
    }
  }

  async function makeApplicationsService(method, value) {
    const endpoint = "/applications";

    const resolvedData = {
      ...data,
      ...value,
    };

    const signedData = await signApiData(resolvedData, account?.encodedAddress);
    return await service(endpoint, method, signedData);
  }

  async function makeApplicationService(method, value) {
    const endpoint = "/application";

    // omit
    const { applicant } = value;
    delete value.applicant;

    const resolvedData = {
      ...data,
      ...value,
      applicantAddress: encodeNetworkAddress(
        applicant.address,
        applicant.bountyIndexer.network,
      ),
    };

    const signedData = await signApiData(resolvedData, account?.encodedAddress);
    return await service(endpoint, method, signedData);
  }

  async function applyService(value) {
    return await makeApplicationsService("post", {
      action: "applyChildBounty",
      applicantNetwork: account?.network,
      ...value,
    });
  }

  async function assignService(value = {}) {
    return await makeApplicationService("patch", {
      action: "assignApplication",
      ...value,
    });
  }

  async function unassignService(value = {}) {
    return await makeApplicationService("patch", {
      action: "unassignApplication",
      ...value,
    });
  }

  async function acceptService(value = {}) {
    return await makeApplicationService("patch", {
      action: "acceptAssignment",
      ...value,
    });
  }

  async function submitWorkService(value = {}) {
    return await makeApplicationService("patch", {
      action: "submitWork",
      ...value,
    });
  }

  async function cancelService(value = {}) {
    return await makeApplicationService("patch", {
      action: "cancelApplication",
      ...value,
    });
  }

  return {
    applyService,
    assignService,
    unassignService,
    acceptService,
    submitWorkService,
    cancelService,
  };
}
