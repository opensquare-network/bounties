import InfoItem from "@/components/Bounty/Detail/Meta/Info/InfoItem";
import {
  InfoContent,
  InfoHeader,
} from "@/components/Bounty/Detail/Meta/Info/styled";

export default function InfoApplicants({ childBountyDetail }) {
  const { applications = [] } = childBountyDetail ?? {};

  return (
    <InfoItem
      title={
        <InfoHeader>
          <span>Applicants</span>
        </InfoHeader>
      }
      content={<InfoContent>{applications.length}</InfoContent>}
    />
  );
}
