import { noop } from "@osn/common-ui";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  childBountyDetailLoadedSelector,
  childBountyDetailSelector,
  fetchChildBountyDetail,
  resetChildBountyDetail,
} from "store/reducers/childBountyDetailSlice";

/**
 * @description ONLY use in page child bounty detail
 */
export function useFetchChildBountyDetail() {
  const childBountyDetail = useSelector(childBountyDetailSelector);
  const childBountyDetailLoaded = useSelector(childBountyDetailLoadedSelector);
  const { network, bountyId, childBountyId } = useParams();

  const $fetchChildBountyDetail = useCallback(() => {
    if (network && bountyId && childBountyId) {
      return fetchChildBountyDetail(network, bountyId, childBountyId);
    }

    return noop;
  }, [network, bountyId, childBountyId]);

  return {
    childBountyDetail,
    childBountyDetailLoaded,
    resetChildBountyDetail,
    fetchChildBountyDetail: $fetchChildBountyDetail,
  };
}
