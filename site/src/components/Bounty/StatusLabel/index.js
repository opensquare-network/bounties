import {
  primary_purple_500,
  secondary_green_500,
  text_dark_accessory,
} from "@osn/common-ui";
import { APPLICATION_STATUS, CHILD_BOUNTY_STATUS } from "utils/constants";
import { Wrapper } from "./styled";

const COLOR_MAP = {
  [CHILD_BOUNTY_STATUS.Open]: secondary_green_500,
  [CHILD_BOUNTY_STATUS.Started]: primary_purple_500,
  [CHILD_BOUNTY_STATUS.Submitted]: primary_purple_500,
  [CHILD_BOUNTY_STATUS.Assigned]: primary_purple_500,
  [CHILD_BOUNTY_STATUS.WorkDone]: text_dark_accessory,
  [APPLICATION_STATUS.Cancelled]: text_dark_accessory,
};

/**
 * @param {{children: string}} props
 */
export default function StatusLabel(props) {
  return <Wrapper hex={COLOR_MAP[props?.children]}>{props?.children}</Wrapper>;
}
