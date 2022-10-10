import { encodeNetworkAddress } from "@osn/common";
import { useAccount } from "hooks/useAccount";
import serverApi from "services/serverApi";
import { signApiData } from "utils/signature";
import { useDispatch } from "react-redux";
import { useFetchChildBountyDetail } from "./useFetchChildBountyDetail";
import { notification } from "@osn/common-ui";
import { handleSigningError } from "utils/exceptionHandle";

export function useWorkflowActionService(childBountyDetail) {
  const dispatch = useDispatch();
  const { network, parentBountyIndex, index } = childBountyDetail ?? {};
  const account = useAccount();

  const { fetchChildBountyDetail } = useFetchChildBountyDetail();

  const data = {
    network,
    parentBountyIndex,
    index,
  };

  async function service(endpoint, method, data) {
    const closePending = notification.pending({
      message: "Signing...",
      timeout: false,
    });

    let signedData;

    try {
      signedData = await signApiData(data, account?.encodedAddress);
    } catch (e) {
      handleSigningError(e);
      throw e;
    } finally {
      closePending();
    }

    try {
      const res = await serverApi[method](endpoint, signedData);

      if (res.result) {
        dispatch(fetchChildBountyDetail());
      }

      if (res.error) {
        return Promise.reject(res.error);
      }

      return res;
    } catch (e) {
      notification.error({
        message: e.message,
      });

      throw e;
    }
  }

  async function makeApplicationsService(method, value) {
    const endpoint = "/applications";

    const resolvedData = {
      ...data,
      ...value,
    };

    return await service(endpoint, method, resolvedData);
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

    return await service(endpoint, method, resolvedData);
  }

  async function applyService(value) {
    try {
      const res = await makeApplicationsService("post", {
        action: "applyChildBounty",
        applicantNetwork: account?.network,
        ...value,
      });

      notification.success({
        message: "Applied",
      });

      return res;
    } catch (e) {
      // ignore
    }
  }

  async function assignService(value = {}) {
    try {
      const res = await makeApplicationService("patch", {
        action: "assignApplication",
        ...value,
      });

      notification.success({
        message: "Assigned",
      });

      return res;
    } catch (e) {
      // ignore
    }
  }

  async function unassignService(value = {}) {
    try {
      const res = await makeApplicationService("patch", {
        action: "unassignApplication",
        ...value,
      });

      notification.success({
        message: "Unassigned",
      });

      return res;
    } catch (e) {
      // ignore
    }
  }

  async function acceptService(value = {}) {
    try {
      const res = await makeApplicationService("patch", {
        action: "acceptAssignment",
        ...value,
      });

      notification.success({
        message: "Accepted",
      });

      return res;
    } catch (e) {
      // ignore
    }
  }

  async function submitWorkService(value = {}) {
    try {
      const res = await makeApplicationService("patch", {
        action: "submitWork",
        ...value,
      });

      notification.success({
        message: "Submitted",
      });

      return res;
    } catch (e) {
      // ignore
    }
  }

  async function cancelService(value = {}) {
    try {
      const res = await makeApplicationService("patch", {
        action: "cancelApplication",
        ...value,
      });

      notification.success({
        message: "Canceled",
      });

      return res;
    } catch (e) {
      // ignore
    }
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
