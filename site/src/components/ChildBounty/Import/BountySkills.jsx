import styled, { css } from "styled-components";
import { Title } from "components/Common/Import/styled";
import { SKILLS } from "utils/constants";
import { useCallback, useMemo } from "react";
import { SkillTag } from "components/Skill/styled";
import {
  netural_grey_800,
  primary_purple_500,
  p_14_medium,
  p_14_normal,
  text_dark_accessory,
  text_dark_major,
} from "@osn/common-ui";

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const SkillItem = styled(SkillTag)`
  ${p_14_medium};
  padding: 2px 12px;
  cursor: pointer;

  &:hover {
    color: ${text_dark_major};
    box-shadow: 0 0 0 1px ${netural_grey_800};
  }

  &.selected {
    color: ${primary_purple_500};
    box-shadow: 0 0 0 1px ${primary_purple_500};
  }

  ${(p) =>
    p.disabled &&
    css`
      &:not(.selected) {
        pointer-events: none;
      }
    `}
`;

const Info = styled.div`
  ${p_14_normal};
  color: ${text_dark_accessory};
  margin-top: 8px;
`;

export default function BountySkills({
  setSelectedSkills,
  selectedSkills,
  max = 3,
}) {
  const isMax = useMemo(
    () => selectedSkills?.length >= max,
    [selectedSkills, max],
  );

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
    <div>
      <Title>Skill</Title>

      <SkillsList>
        {SKILLS.map((item) => (
          <SkillItem
            key={item}
            className={selectedSkills?.includes(item) ? "selected" : ""}
            onClick={() => selectSkill(item)}
            disabled={isMax}
          >
            {item}
          </SkillItem>
        ))}
      </SkillsList>

      <Info>
        Select up to 3 required tags for this bounty to get the right
        contributors
      </Info>
    </div>
  );
}
