import React from "react";
import styled from "styled-components";
import { p_14_normal } from "@osn/common-ui/es/styles/textStyles";
import { LoadingIcon } from "@osn/common-ui";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  background: #fbfcfe;
  border-bottom: 1px solid #e2e8f0;
  :hover,
  :focus,
  :focus-within,
  :active {
    border-color: #b7c0cc;
  }

  & > input {
    all: unset;
    padding: 12px 16px;
    width: 100%;
    ${p_14_normal};
    color: #1e2134;
    ::placeholder {
      color: #9da9bb;
    }
    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

export default function LoadingInput({ loading, ...props }) {
  return (
    <Wrapper>
      <input {...props} />
      {loading && <LoadingIcon />}
    </Wrapper>
  );
}
