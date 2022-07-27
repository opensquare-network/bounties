import InfoItem from "components/Bounty/Detail/Meta/Info/InfoItem";
import {
  InfoContent,
  InfoHeader,
} from "components/Bounty/Detail/Meta/Info/styled";

export default function InfoParentBounty({ childBountyDetail }) {
  const { parentBounty = {} } = childBountyDetail ?? {};

  return (
    <InfoItem
      title={
        <InfoHeader>
          <span>Parent Bounty</span>
        </InfoHeader>
      }
      content={<InfoContent>{parentBounty.title}</InfoContent>}
    />
  );
}
