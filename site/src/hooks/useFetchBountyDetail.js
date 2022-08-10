import { noop } from "@osn/common-ui";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  bountyDetailSelector,
  fetchBountyDetail,
  setBountyDetail,
} from "store/reducers/bountyDetailSlice";

/**
 * @description ONLY use in page bounty detail
 */
export function useFetchBountyDetail() {
  const bountyDetail = useSelector(bountyDetailSelector);
  const { network, bountyId } = useParams();

  function $fetchBountyDetail() {
    if (network && bountyId) {
      return fetchBountyDetail(network, bountyId);
    }

    return noop;
  }

  function resetBountyDetail() {
    setBountyDetail(null);
  }

  return {
    bountyDetail,
    fetchBountyDetail: $fetchBountyDetail,
    resetBountyDetail,
    fetchBountyDetailEffectDeps: [network, bountyId],
  };
}
