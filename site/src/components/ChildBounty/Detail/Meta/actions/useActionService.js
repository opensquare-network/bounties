import { useAccount } from "hooks/useAccount";
import serverApi from "services/serverApi";

export function useActionService(childBountyDetail) {
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

  async function apply(value) {
    data.data.action = "applyChildBounty";
    data.data.description = value.content;
    data.data.applicantNetwork = account?.network;

    return serverApi.post("/applications", data).then(({ error }) => {
      if (error) {
        // TODO: error toast
      }
    });
  }

  return {
    apply,
  };
}
