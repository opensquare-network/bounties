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
    action: "",
    network,
    parentBountyIndex,
    index,
  };

  const showErrorToast = (message) => {
    dispatch(newErrorToast(message));
  };

  async function applyService(value) {
    data.action = "applyChildBounty";
    data.description = value.content;
    data.applicantNetwork = account?.network;
    const signedData = await signApiData(data, account?.encodedAddress);

    try {
      const res = await serverApi.post("/applications", signedData);

      if (res.result) {
        reloadData && reloadData();
      }

      if (res.error) {
        return showErrorToast(res.error.message);
      }

      return res;
    } catch {}
  }

  async function assignService(value = {}) {
    data.action = "assignApplication";
    data.applicantAddress = encodeNetworkAddress(
      value.applicantAddress,
      value.applicantNetwork,
    );
    const signedData = await signApiData(data, account?.encodedAddress);

    try {
      const res = await serverApi.patch("/application", signedData);

      if (res.result) {
        reloadData && reloadData();
      }

      if (res.error) {
        return showErrorToast(res.error.message);
      }

      return res;
    } catch {}
  }

  async function unassignService(value = {}) {
    data.action = "unassignApplication";
    data.applicantAddress = encodeNetworkAddress(
      value.applicantAddress,
      value.applicantNetwork,
    );
    const signedData = await signApiData(data, account?.encodedAddress);

    try {
      const res = await serverApi.patch("/application", signedData);

      if (res.result) {
        reloadData && reloadData();
      }

      if (res.error) {
        return showErrorToast(res.error.message);
      }

      return res;
    } catch {}
  }

  async function acceptService(value = {}) {
    data.action = "acceptAssignment";
    data.applicantAddress = encodeNetworkAddress(
      value.applicantAddress,
      value.applicantNetwork,
    );
    const signedData = await signApiData(data, account?.encodedAddress);

    try {
      const res = await serverApi.patch("/application", signedData);

      if (res.result) {
        reloadData && reloadData();
      }

      if (res.error) {
        return showErrorToast(res.error.message);
      }

      return res;
    } catch {}
  }

  async function submitWorkService(value = {}) {
    data.action = "submitWork";
    data.applicantAddress = encodeNetworkAddress(
      value.applicantAddress,
      value.applicantNetwork,
    );
    data.description = value.description;
    data.link = value.link;
    const signedData = await signApiData(data, account?.encodedAddress);

    try {
      const res = await serverApi.patch("/application", signedData);

      if (res.result) {
        reloadData && reloadData();
      }

      if (res.error) {
        return showErrorToast(res.error.message);
      }

      return res;
    } catch {}
  }

  return {
    applyService,
    assignService,
    unassignService,
    acceptService,
    submitWorkService,
  };
}
