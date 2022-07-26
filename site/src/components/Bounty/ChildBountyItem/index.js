import {
  Card,
  IdentityUser,
  FlexCenter,
  FlexBetween,
  ChainIcon,
  Dot,
} from "@osn/common-ui";
import BountyTag from "../BountyTag";
import { Link } from "react-router-dom";
import { Title } from "../styled/bounty";
import { Mark } from "./styled";
import SkillList from "./SkillList";

export default function ChildBountyItem({ children, ...props } = {}) {
  const {
    network,
    address,
    title,
    childBounty,
    parentBountyIndex,
    index,
    skills = [],
  } = props ?? {};

  return (
    <Card
      size="small"
      title={
        <Title>
          <Link
            to={`/network/${network}/bounty/${parentBountyIndex}/child-bounty/${index}`}
          >
            {title}
          </Link>
        </Title>
      }
      prefix={
        <div>
          <ChainIcon chainName={network} size={64} />
        </div>
      }
    >
      <FlexBetween>
        <FlexCenter>
          {/* FIXME: status */}
          <span>Open</span>
          <Dot />
          <Mark>Curated by</Mark>
          <IdentityUser network={network} address={address} />

          {!!skills.length && (
            <>
              <Dot />
              <SkillList skills={skills} />
            </>
          )}
        </FlexCenter>

        <BountyTag {...childBounty} />
      </FlexBetween>
    </Card>
  );
}
