import InfoFunder from "./InfoFunder";
import InfoCurator from "./InfoCurator";
import InfoBountyId from "./InfoBountyId";
import InfoChildBounties from "./InfoChildBounties";
import InfoRelatedLinks from "./InfoRelatedLinks";
import { InfoWrapper } from "./styled";

export default function Info({ bountyDetail }) {
  return (
    <InfoWrapper>
      <InfoFunder bountyDetail={bountyDetail} />
      <InfoCurator bountyDetail={bountyDetail} />
      <InfoBountyId bountyDetail={bountyDetail} />
      <InfoChildBounties bountyDetail={bountyDetail} />
      <InfoRelatedLinks bountyDetail={bountyDetail} />
    </InfoWrapper>
  );
}
