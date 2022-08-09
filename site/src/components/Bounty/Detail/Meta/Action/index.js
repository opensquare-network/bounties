import { encodeNetworkAddress } from "@osn/common/src";
import { useSelector } from "react-redux";
import { accountSelector } from "store/reducers/accountSlice";
import { BOUNTY_STATUS } from "utils/constants";
import ClosedBountyCuratorActions from "./ClosedBountyCuratorActions";
import OpenBountyCuratorActions from "./OpenBountyCuratorActions";

export default function Action({ bountyDetail, reloadData }) {
  const account = useSelector(accountSelector);

  if (!bountyDetail) {
    return null;
  }

  const {
    status,
    bounty: { curators },
  } = bountyDetail || {};

  let isCurator = false;
  if (account) {
    const signer = encodeNetworkAddress(account?.address, account?.network);
    isCurator = curators?.includes(signer);
  }

  if (status === BOUNTY_STATUS.Open && isCurator) {
    return (
      <OpenBountyCuratorActions
        bountyDetail={bountyDetail}
        reloadData={reloadData}
      />
    );
  } else if (status === BOUNTY_STATUS.Closed && isCurator) {
    return (
      <ClosedBountyCuratorActions
        bountyDetail={bountyDetail}
        reloadData={reloadData}
      />
    );
  } else {
    return null;
  }
}
