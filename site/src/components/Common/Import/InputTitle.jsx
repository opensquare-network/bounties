import { Title } from "./styled";
import { Input, LoadingIcon } from "@osn/common-ui";
import { ErrorMessage } from "components/Common/Import/styled";

export default function InputTitle({ title, setTitle, isLoading, errorMsg }) {
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
      {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
    </>
  );
}
