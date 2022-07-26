import { Title } from "./styled";
import RichEditor from "@osn/common-ui/es/RichEditor";

export default function InputDescription({ content, setContent, isLoading }) {
  return (
    <>
      <Title>Description</Title>
      <RichEditor
        content={content}
        setContent={setContent}
        disabled={isLoading}
        showSubmitButton={false}
      />
    </>
  );
}
