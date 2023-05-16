import { SkillListWrapper, SkillTag } from "./styled";

export default function SkillList({ skills = [] }) {
  return (
    <SkillListWrapper>
      {skills.map((skill) => (
        <li key={skill}>
          <SkillTag>{skill}</SkillTag>
        </li>
      ))}
    </SkillListWrapper>
  );
}
