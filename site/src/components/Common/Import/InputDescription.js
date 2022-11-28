import { RichEditor } from "@osn/common-ui";
import { Title } from "./styled";
import { ErrorMessage } from "components/Common/Import/styled";
import styled from "styled-components";

const CustomErrorMessage = styled(ErrorMessage)`
  margin-top: 16px;
`;

export default function InputDescription({
  content,
  setContent,
  isLoading,
  errorMsg,
  ...restProps
}) {
  return (
    <>
      <Title>Description</Title>
      <RichEditor
        content={content}
        setContent={setContent}
        disabled={isLoading}
        showSubmitButton={false}
        errorMsg={<CustomErrorMessage>{errorMsg}</CustomErrorMessage>}
        {...restProps}
      />
    </>
  );
}
