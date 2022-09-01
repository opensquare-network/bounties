import { noop } from "@osn/common-ui";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  bountyDetailSelector,
  fetchBountyDetail,
  resetBountyDetail,
} from "store/reducers/bountyDetailSlice";

/**
 * @description ONLY use in page bounty detail
 */
export function useFetchBountyDetail() {
  const bountyDetail = useSelector(bountyDetailSelector);
  const { network, bountyId } = useParams();

  const $fetchBountyDetail = useCallback(() => {
    if (network && bountyId) {
      return fetchBountyDetail(network, bountyId);
    }

    return noop;
  }, [network, bountyId]);

  return {
    bountyDetail,
    fetchBountyDetail: $fetchBountyDetail,
    resetBountyDetail,
  };
}
