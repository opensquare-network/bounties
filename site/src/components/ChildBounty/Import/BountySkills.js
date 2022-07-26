import styled from "styled-components";
import { Title } from "components/Common/Import/styled";
import { SKILLS } from "utils/constants";
import { useCallback } from "react";

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SkillItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 12px;

  border: 1px solid #b7c0cc;
  border-radius: 14px;

  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  color: #a1a8b3;

  cursor: pointer;

  &:hover {
    border-color: #292d36;
    color: #1e2134;
  }

  &.selected {
    border-color: #6848ff;
    color: #6848ff;
  }
`;

const Info = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: #a1a8b3;
`;

export default function BountySkills({ setSelectedSkills, selectedSkills }) {
  const selectSkill = useCallback(
    (skill) => {
      const skills = new Set(selectedSkills);
      if (skills.has(skill)) {
        skills.delete(skill);
      } else {
        skills.add(skill);
      }
      setSelectedSkills(Array.from(skills));
    },
    [setSelectedSkills, selectedSkills],
  );

  return (
    <>
      <Title>Skill</Title>
      <SkillsList>
        {SKILLS.map((item) => (
          <SkillItem
            key={item}
            className={selectedSkills.includes(item) ? "selected" : ""}
            onClick={() => selectSkill(item)}
          >
            {item}
          </SkillItem>
        ))}
      </SkillsList>
      <Info>
        Select up to 3 required tags for this bounty to get the right
        contributors
      </Info>
    </>
  );
}
