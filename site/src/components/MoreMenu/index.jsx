import { useRef, useState } from "react";
import styled from "styled-components";
import { FlexBetween } from "@osn/common-ui";
import { useOnClickOutside } from "@osn/common";
import MoreButton from "./MoreButton";

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Inner = styled.div`
  position: relative;
  flex-direction: column;
`;

const MoreActions = styled.div`
  padding: 16px;
  display: flex;
  gap: 8px;
  position: absolute;
  right: 0;
  top: 26px;
  background-color: white;
  box-shadow: 0px 4px 31px rgba(26, 33, 44, 0.06),
    0px 0.751293px 8px rgba(26, 33, 44, 0.04);
`;

const MoreActionItem = styled(FlexBetween)`
  user-select: none;
  width: 128px;
  cursor: pointer;
  color: #506176;
  &:hover {
    color: #1e2134;
  }
`;

export default function MoreMenu({ menus }) {
  const [showMenu, setShowMenu] = useState(false);
  const buttonRef = useRef(null);
  useOnClickOutside(buttonRef, () => setShowMenu(false));

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <Wrapper>
      <Inner>
        <MoreButton onClick={toggleMenu} />
        <div ref={buttonRef}>
          {showMenu && (
            <MoreActions>
              {menus?.map((menu, index) => (
                <MoreActionItem
                  key={index}
                  onClick={() => {
                    setShowMenu(false);
                    menu.onClick?.();
                  }}
                >
                  <span>{menu.text}</span>
                  {menu.icon}
                </MoreActionItem>
              ))}
            </MoreActions>
          )}
        </div>
      </Inner>
    </Wrapper>
  );
}
