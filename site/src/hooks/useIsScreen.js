// TODO: move to @osn/common

import { useWindowSize } from "@osn/common/src";
import { MOBILE_SIZE } from "@osn/constants";

export function useIsScreen() {
  const { width } = useWindowSize();

  return {
    isDesktop: width > MOBILE_SIZE,
    isMobile: width <= MOBILE_SIZE,
  };
}
