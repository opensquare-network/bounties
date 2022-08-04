import { useAccount } from "hooks/useAccount";
import serverApi from "services/serverApi";

export function useWorkflowActionService(childBountyDetail) {
  const { network, parentBountyIndex, index } = childBountyDetail ?? {};
  const account = useAccount();

  const data = {
    address: account?.address,
    signature: "test-signature",
    data: {
      network,
      parentBountyIndex,
      index,
    },
  };

  async function applyService(value) {
    data.data.action = "applyChildBounty";
    data.data.description = value.content;
    data.data.applicantNetwork = account?.network;

    try {
      const res = await serverApi.post("/applications", data);

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
