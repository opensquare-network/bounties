import InfoItem from "./InfoItem";
import { InfoContent, InfoHeader } from "./styled";
import { LinkIdentityUser } from "@osn/common-ui";

export default function InfoCurator({ bountyDetail }) {
  return (
    <InfoItem
      title={<InfoHeader>Curator</InfoHeader>}
      content={
        <InfoContent>
          <LinkIdentityUser
            explore
            network={bountyDetail?.network}
            address={bountyDetail?.bounty?.curators?.[0]}
          />
        </InfoContent>
      }
    />
  );
}
