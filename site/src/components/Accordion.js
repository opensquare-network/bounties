import React, { useState, memo } from "react";
import styled from "styled-components";
import { ReactComponent as Caret } from "imgs/icons/caret.svg";

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

const Items = styled.article`
  display: ${(props) => (props.show ? "block" : "none")};
  margin-top: 16px;
`;

function Accordion({ children, title, showFold = true }) {
  const [fold, setFold] = useState(false);

  return (
    <Wrapper>
      <Title>
        <div>{title}</div>
        {showFold && (
          <span onClick={() => setFold(!fold)}>
            <Caret size={16} isGrey={true} down={fold} />
          </span>
        )}
      </Title>
      <Items show={!fold}>{children}</Items>
    </Wrapper>
  );
}

export default memo(Accordion);
