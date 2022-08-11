import styled from "styled-components";
import Input from "@osn/common-ui/es/styled/Input";
import Tooltip from "@osn/common-ui/es/Tooltip";
import FlexCenter from "@osn/common-ui/es/styled/FlexCenter";
import { Title } from "../Import/styled";

const InputAndError = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default function DisabledInputBountyId({
  title,
  tooltip,
  bountyId,
}) {
  return (
    <>
      <Title>
        <span>{title}</span>
        <Tooltip content={tooltip} size="fit">
          <div>
            <FlexCenter>
              <img src="/imgs/icons/question.svg" alt="" />
            </FlexCenter>
          </div>
        </Tooltip>
      </Title>
      <InputAndError>
        <Input
          defaultValue={bountyId}
          placeholder="0"
          style={{ background: "#f0f3f8" }}
        />
      </InputAndError>
    </>
  );
}
