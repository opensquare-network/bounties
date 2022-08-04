import { useAccount } from "hooks/useAccount";
import serverApi from "services/serverApi";
import { signApiData } from "utils/signature";

export function useWorkflowActionService(childBountyDetail) {
  const { network, parentBountyIndex, index } = childBountyDetail ?? {};
  const account = useAccount();

  const data = {
    action: "",
    network,
    parentBountyIndex,
    index,
  };

  async function applyService(value) {
    data.action = "applyChildBounty";
    data.description = value.content;
    data.applicantNetwork = account?.network;
    const signedData = await signApiData(data, account?.address);

    try {
      const res = await serverApi.post("/applications", signedData);

      // TODO: error toast
      if (res.error) {
      }

      return res;
    } catch {}
  }

  return {
    applyService,
  };
}
