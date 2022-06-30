import Input from "@osn/common-ui/es/styled/Input";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;

  img {
    position: absolute;
    top: 12px;
    left: 16px;
  }

  input {
    padding-left: 48px;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    -moz-appearance: textfield;
  }
`;

function AssetInput({ value, onChange }) {
  return (
    <Wrapper>
      <img src={"/imgs/icons/assets/unknown.svg"} alt="" width={"24px"} height={"24px"} />
      <Input type="number" {...{ value, onChange }} placeholder="Enter an asset ID" />
    </Wrapper>
  );
}

export default AssetInput;
