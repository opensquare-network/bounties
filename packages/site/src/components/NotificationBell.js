import styled from "styled-components";
import { Link } from "react-router-dom";
import FlexCenter from "@osn/common-ui/es/styled/FlexCenter";

const Wrapper = styled(FlexCenter)`
  width: 38px;
  height: 38px;
  border: 1px solid #e2e8f0;

  &:hover {
    border-color: #b7c0cc;
  }

  cursor: pointer;
`;

export default function NotificationBell() {
  return (
    <Link to="/notifications">
      <Wrapper>
        <img
          src={"/imgs/icons/unread-notification.svg"}
          alt=""
        />
      </Wrapper>
    </Link>
  );
}
