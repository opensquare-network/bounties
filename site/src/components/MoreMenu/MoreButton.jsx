import styled from "styled-components";
import { ReactComponent as MoreSVG } from "./more.svg";

const MoreButton = styled(MoreSVG)`
  cursor: pointer;
  :hover {
    path {
      fill: #506176;
    }
  }
`;

export default MoreButton;
