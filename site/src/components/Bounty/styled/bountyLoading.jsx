import React from "react";
import { Loading } from "./loading";
import { ReactComponent as HeadLoading } from "./loading/bounty/headLoading.svg";
import { ReactComponent as DetailLoading } from "./loading/bounty/detailLoading.svg";

export const headLoading = (
  <Loading>
    <HeadLoading />
  </Loading>
);

export const detailLoading = (
  <Loading>
    <DetailLoading />
  </Loading>
);
