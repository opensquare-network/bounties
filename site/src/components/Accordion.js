import React, { useState, memo } from "react";
import styled, { css } from "styled-components";
import { ReactComponent as Caret } from "imgs/icons/caret.svg";
import { Divider } from "@osn/common-ui";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-weight: bold;
    font-size: 16px;
  }

  svg {
    cursor: pointer;
  }
`;

const RotateCaret = styled(Caret)`
  & {
    transform: rotate(${(props) => (props.fold ? 180 : 0)}deg);
  }
  &:hover {
    path {
      fill: #506176;
    }
  }
`;

const Items = styled.article`
  display: ${(props) => (props.show ? "block" : "none")};

  ${(p) =>
    !p.divider &&
    css`
      margin-top: 16px;
    `}
`;

function Accordion({ children, title, showFold = true, divider }) {
  const [fold, setFold] = useState(false);

  return (
    <Wrapper>
      <Title>
        <div>{title}</div>
        {showFold && (
          <span onClick={() => setFold(!fold)}>
            <RotateCaret fold={fold} />
          </span>
        )}
      </Title>

      {divider && <Divider />}

      <Items divider={divider} show={!fold}>
        {children}
      </Items>
    </Wrapper>
  );
}

export default memo(Accordion);
