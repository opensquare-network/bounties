import { Title } from "./styled";
import LoadingInput from "../../LoadingInput";

export default function InputTitle({ title, setTitle, isLoading }) {
  return (
    <>
      <Title>Title</Title>
      <LoadingInput
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        placeholder="Input title here..."
        disabled={isLoading}
        loading={isLoading}
      />
    </>
  );
}
