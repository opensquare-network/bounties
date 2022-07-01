import styled from "styled-components";
import { useState } from "react";
import { p_12_normal, p_14_medium } from "@osn/common-ui/es/styles/textStyles";

const Wrapper = styled.div``;

const FloatingWrapper = styled.ul`
  position: absolute;
  left: 0;
  right: 0;
  top: 60px;
  z-index: 1;
  margin: 0;
  padding: 4px 20px;
  background: white;
  li {
    padding-top: 16px;
    padding-bottom: 16px;
    ::before {
      content: "";
      background-image: url("/imgs/icons/caret-right.svg");
      float: right;
      margin-top: 9px;
      height: 24px;
      width: 24px;
    }
  }

  * {
    margin: 0;
    display: block;
    ${p_14_medium};
    color: #1e2134;
  }

  span {
    ${p_12_normal};
    color: #a1a8b3;
  }

  > :not(:last-child) {
    border-bottom: 1px solid #f0f3f8;
  }
`;

function MobileMenu() {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <Wrapper
      onClick={() => {
        setShowMenu(!showMenu);
      }}
    >
      <img src={`/imgs/icons/${showMenu ? "close" : "menu"}.svg`} alt="" />
      {showMenu && (
        <FloatingWrapper>
          <li>
            <a href="https://voting.opensquare.io/">
              <p>Off-chain Voting</p>
              <span>Multi-chain assets off-chain voting platform</span>
            </a>
          </li>
          <li>
            <a href="/">
              <p>Bounties</p>
              <span>Decentralized bounties platform</span>
            </a>
          </li>
        </FloatingWrapper>
      )}
    </Wrapper>
  );
}

export default MobileMenu;
