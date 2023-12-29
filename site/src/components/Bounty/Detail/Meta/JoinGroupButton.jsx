import styled from "styled-components";
import { ReactComponent as JoinGroupIcon } from "./icons/join-group.svg";

const JoinGroup = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 4px;

  width: 99px;
  height: 32px;

  background: var(--fillBgTertiary);
  border-radius: 18px;

  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;

  color: #a1a8b3;
  cursor: pointer;

  :hover {
    svg path {
      fill: #6848ff;
    }
    color: #6848ff;
    background: #f2f0ff;
  }
`;

export default function JoinGroupButton() {
  return (
    <JoinGroup>
      <JoinGroupIcon />
      Join Group
    </JoinGroup>
  );
}
