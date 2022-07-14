import { Loading } from "./loading";
import { ReactComponent as MetaLoading } from "./loading/meta/metaLoading.svg";
import { ReactComponent as DescriptionLoading } from "./loading/meta/descriptionLoading.svg";

export const metaLoading = (
  <Loading>
    <MetaLoading />
  </Loading>
);

export const descriptionLoading = (
  <Loading>
    <DescriptionLoading />
  </Loading>
);
