import { SkillListWrapper, SkillTag } from "./styled";

export default function SkillList({ skills = [] }) {
  return (
    <SkillListWrapper>
      {skills.map((skill) => (
        <SkillTag>{skill}</SkillTag>
      ))}
    </SkillListWrapper>
  );
}
