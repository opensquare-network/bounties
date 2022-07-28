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
import StatusLabel from "../StatusLabel";
import { resolveChildBountyDetailRoute } from "utils/route";

export default function ChildBountyItem({ children, ...props } = {}) {
  const {
    network,
    address,
    title,
    childBounty,
    parentBountyIndex,
    index,
    skills = [],
    status,
  } = props ?? {};

  return (
    <Card
      size="small"
      title={
        <Title>
          <Link
            to={resolveChildBountyDetailRoute(
              network,
              parentBountyIndex,
              index,
            )}
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
          <StatusLabel>{status}</StatusLabel>
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
