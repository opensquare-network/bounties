import styled from "styled-components";
import Input from "@osn/common-ui/es/styled/Input";
import Tooltip from "@osn/common-ui/es/Tooltip";
import FlexCenter from "@osn/common-ui/es/styled/FlexCenter";
import { Title, ErrorMessage } from "./styled";

const InputAndError = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default function InputBountyId({
  title,
  tooltip,
  bountyId,
  setBountyId,
  isLoading,
  errorMsg,
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
          value={bountyId}
          onChange={(e) => {
            setBountyId(e.target.value);
          }}
          placeholder="0"
          disabled={isLoading}
        />
        {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
      </InputAndError>
    </>
  );
}
