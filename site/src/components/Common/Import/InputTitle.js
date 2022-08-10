import { Title } from "./styled";
import { Input, LoadingIcon } from "@osn/common-ui";

export default function InputTitle({ title, setTitle, isLoading }) {
  return (
    <>
      <Title>Title</Title>
      <Input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        placeholder="Input title here..."
        disabled={isLoading}
        suffix={isLoading && <LoadingIcon />}
      />
    </>
  );
}
