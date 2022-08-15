import { BOUNTY_STATUS } from "utils/constants";
import ClosedBountyCuratorActions from "./ClosedBountyCuratorActions";
import OpenBountyCuratorActions from "./OpenBountyCuratorActions";

export default function Action({ bountyDetail }) {
  if (!bountyDetail) {
    return null;
  }

  const { status } = bountyDetail || {};

  if (status === BOUNTY_STATUS.Open) {
    return <OpenBountyCuratorActions bountyDetail={bountyDetail} />;
  } else if (status === BOUNTY_STATUS.Closed) {
    return <ClosedBountyCuratorActions bountyDetail={bountyDetail} />;
  } else {
    return null;
  }
}
