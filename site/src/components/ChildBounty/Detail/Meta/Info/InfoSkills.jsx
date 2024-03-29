import InfoItem from "@/components/Bounty/Detail/Meta/Info/InfoItem";
import {
  InfoContent,
  InfoHeader,
} from "@/components/Bounty/Detail/Meta/Info/styled";
import SkillList from "@/components/Skill/List";

export default function InfoSkills({ childBountyDetail }) {
  const { skills = [] } = childBountyDetail ?? {};

  return (
    <InfoItem
      title={
        <InfoHeader>
          <span>Skills</span>
        </InfoHeader>
      }
      content={
        <InfoContent>
          {skills.length ? <SkillList skills={skills} /> : "-"}
        </InfoContent>
      }
    />
  );
}
