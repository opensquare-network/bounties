import InfoItem from "components/Bounty/Detail/Meta/Info/InfoItem";
import {
  InfoContent,
  InfoHeader,
} from "components/Bounty/Detail/Meta/Info/styled";

export default function InfoParentBounty({ childBountyDetail }) {
  const { parentBountyIndex } = childBountyDetail ?? {};

  return (
    <InfoItem
      title={
        <InfoHeader>
          <span>Parent Bounty</span>
        </InfoHeader>
      }
      // FIXME: is should be parent bounty title
      content={<InfoContent>{parentBountyIndex}</InfoContent>}
    />
  );
}
