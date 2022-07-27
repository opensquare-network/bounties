import InfoItem from "components/Bounty/Detail/Meta/Info/InfoItem";
import {
  InfoContent,
  InfoHeader,
} from "components/Bounty/Detail/Meta/Info/styled";

export default function InfoApplicants({ childBountyDetail }) {
  const { childBounty } = childBountyDetail ?? {};
  // FIXME: which value, now is `curators` instead
  const applicants = childBounty?.curators;

  return (
    <InfoItem
      title={
        <InfoHeader>
          <span>Applicants</span>
        </InfoHeader>
      }
      content={<InfoContent>{applicants?.length}</InfoContent>}
    />
  );
}
