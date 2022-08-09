import { noop } from "@osn/common-ui";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  childBountyDetailSelector,
  fetchChildBountyDetail,
  setChildBountyDetail,
} from "store/reducers/childBountyDetailSlice";

/**
 * @description ONLY use in page child bounty detail
 */
export function useFetchChildBountyDetail() {
  const childBountyDetail = useSelector(childBountyDetailSelector);
  const { network, bountyId, childBountyId } = useParams();

  function $fetchChildBountyDetail() {
    if (network && bountyId && childBountyId) {
      return fetchChildBountyDetail(network, bountyId, childBountyId);
    }

    return noop;
  }

  function resetChildBountyDetail() {
    setChildBountyDetail(null);
  }

  return {
    childBountyDetail,
    resetChildBountyDetail,
    fetchChildBountyDetail: $fetchChildBountyDetail,
    childBountyDetailEffectDeps: [network, bountyId, childBountyId],
  };
}
