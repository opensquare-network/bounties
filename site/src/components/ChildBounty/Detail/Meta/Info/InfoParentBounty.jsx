import InfoItem from "@/components/Bounty/Detail/Meta/Info/InfoItem";
import {
  InfoContent,
  InfoHeader,
} from "@/components/Bounty/Detail/Meta/Info/styled";
import Ellipsis from "@/components/Ellipsis";
import { Link } from "react-router-dom";
import { resolveBountyDetailRoute } from "@/utils/route";

export default function InfoParentBounty({ childBountyDetail }) {
  const {
    parentBounty = {},
    parentBountyIndex = "",
    network,
  } = childBountyDetail ?? {};

  return (
    <InfoItem
      title={
        <InfoHeader>
          <span>Parent Bounty</span>
        </InfoHeader>
      }
      content={
        <InfoContent>
          <Ellipsis>
            <Link
              title={parentBounty.title}
              to={resolveBountyDetailRoute(network, parentBountyIndex)}
            >
              {parentBounty.title}
            </Link>
          </Ellipsis>
        </InfoContent>
      }
    />
  );
}
