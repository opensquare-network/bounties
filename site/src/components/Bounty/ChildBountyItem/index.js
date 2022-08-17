import {
  Card,
  IdentityUser,
  FlexCenter,
  FlexBetween,
  ChainIcon,
  Dot,
  MobileInvisible,
  MobileVisible,
} from "@osn/common-ui";
import BountyTag from "../BountyTag";
import { Link } from "react-router-dom";
import { Title } from "../styled/bounty";
import { Mark } from "./styled";
import StatusLabel from "../StatusLabel";
import { resolveChildBountyDetailRoute } from "utils/route";
import SkillList from "components/Skill/List";

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
        <MobileInvisible>
          <ChainIcon chainName={network} size={64} />
        </MobileInvisible>
      }
    >
      <FlexBetween>
        <FlexCenter>
          <MobileVisible>
            <FlexCenter>
              <ChainIcon chainName={network} size={20} />
              <Dot />
            </FlexCenter>
          </MobileVisible>
          <StatusLabel>{status}</StatusLabel>
          <MobileInvisible>
            <Dot />
            <Mark>Curated by</Mark>
            <IdentityUser network={network} address={address} />

            {!!skills.length && (
              <>
                <Dot />
                <SkillList skills={skills} />
              </>
            )}
          </MobileInvisible>
        </FlexCenter>

        <BountyTag {...childBounty} />
      </FlexBetween>
    </Card>
  );
}
