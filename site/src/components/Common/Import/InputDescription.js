import { RichEditor } from "@osn/common-ui";
import { Title } from "./styled";

export default function InputDescription({
  content,
  setContent,
  isLoading,
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
        {...restProps}
      />
    </>
  );
}
