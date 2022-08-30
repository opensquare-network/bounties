import styled from "styled-components";
import { Input, FlexCenter, LoadingIcon } from "@osn/common-ui";
import Tooltip from "@osn/common-ui/es/Tooltip";
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
  errorMsg,
  disabled,
  isLoading,
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
          disabled={disabled}
          suffix={isLoading && <LoadingIcon />}
        />
        {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
      </InputAndError>
    </>
  );
}
