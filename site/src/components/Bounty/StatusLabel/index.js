import {
  primary_purple_500,
  secondary_green_500,
  secondary_red_500,
  text_dark_accessory,
} from "@osn/common-ui/es/styles/colors";
import { Wrapper } from "./styled";

const COLOR_MAP = {
  open: secondary_green_500,
  closed: secondary_red_500,
  started: primary_purple_500,
  submitted: primary_purple_500,
  "work done": text_dark_accessory,
};

/**
 * @param {{children: string}} props
 */
export default function StatusLabel(props) {
  return <Wrapper hex={COLOR_MAP[props?.children]}>{props?.children}</Wrapper>;
}
