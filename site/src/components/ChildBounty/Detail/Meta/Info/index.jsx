import InfoCurator from "components/Bounty/Detail/Meta/Info/InfoCurator";
import InfoFunder from "components/Bounty/Detail/Meta/Info/InfoFunder";
import InfoRelatedLinks from "components/Bounty/Detail/Meta/Info/InfoRelatedLinks";
import { InfoWrapper } from "components/Bounty/Detail/Meta/Info/styled";
import InfoApplicants from "./InfoApplicants";
import InfoChildBountyId from "./InfoChildBountyId";
import InfoParentBounty from "./InfoParentBounty";
import InfoSkills from "./InfoSkills";

export default function Info({ childBountyDetail }) {
  const { childBounty, index } = childBountyDetail ?? {};

  const curatorDetail = {
    ...childBountyDetail,
    bounty: childBounty,
  };

  const relatedLinksDetail = {
    ...childBountyDetail,
    bountyIndex: index,
  };

  return (
    <InfoWrapper>
      <InfoFunder bountyDetail={childBountyDetail} />
      <InfoCurator bountyDetail={curatorDetail} />
      <InfoChildBountyId childBountyDetail={childBountyDetail} />
      <InfoApplicants childBountyDetail={childBountyDetail} />
      <InfoRelatedLinks
        bountyDetail={relatedLinksDetail}
        subsquareUrlPath="child-bounty"
        dotreasuryUrlPath="child-bounties"
        polkassemblyUrlPath="child_bounty"
      />
      <InfoParentBounty childBountyDetail={childBountyDetail} />
      <InfoSkills childBountyDetail={childBountyDetail} />
    </InfoWrapper>
  );
}
