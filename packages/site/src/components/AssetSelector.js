import { useEffect, useState } from "react";
import styled from "styled-components";
import DropdownSelector from "@osn/common-ui/es/DropdownSelector";
import Flex from "@osn/common-ui/es/styled/Flex";
import { ASSETS, TEST_ASSETS } from "../utils/constants";

const Wrapper = styled.div`
  > div div {
    z-index: 10;
  }
`;

const AssetWrapper = styled(Flex)`
  > :first-child {
    margin-right: 8px;
  }
`;

const IconsMap = {
  karura: "karura.svg",
  rmrk: "rmrk.svg",
  polarisdao: "polarisdao.png",
  polkadot: "polkadot.svg",
  kusama: "kusama.svg",
  khala: "khala.svg",
  bifrost: "bifrost.svg",
  kintsugi: "kintsugi.svg",
  opensquare: "osn.svg",
  westend: "westend.svg",
};

function getAssetIcon(assetKey) {
  if (assetKey === "all") {
    return null;
  }
  const icon = IconsMap[assetKey] || "unknown.svg";
  return (
    <img
      src={`/imgs/icons/assets/${icon}`}
      alt=""
      width={"24px"}
      height={"24px"}
    />
  );
}

function AssetItem({ assetKey, assetName }) {
  return (
    <AssetWrapper>
      {getAssetIcon(assetKey)}
      <span>{assetName}</span>
    </AssetWrapper>
  );
}

const Assets = [
  {
    id: "all",
    name: "All Assets",
  },
];
if (process.env.REACT_APP_ENVIRONMENT === "production") {
  Assets.push(...ASSETS);
}
if (process.env.REACT_APP_ENVIRONMENT === "development") {
  Assets.push(...TEST_ASSETS);
}

export default function AssetSelector({ asset, setAsset }) {
  const index = Assets.findIndex((item) => item.id === asset?.id);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(
    index === -1 ? 0 : index
  );
  const assetsOptions = Assets.map((item, i) => {
    return {
      key: i,
      value: i,
      content: (
        <AssetItem assetKey={item.id} assetName={item.symbol || item.name} />
      ),
    };
  });

  useEffect(() => {
    if (setAsset) {
      setAsset(Assets[selectedAssetIndex]);
    }
  }, [setAsset, selectedAssetIndex]);

  return (
    <Wrapper>
      <DropdownSelector
        options={assetsOptions}
        value={selectedAssetIndex}
        onSelect={(value) => setSelectedAssetIndex(value)}
      />
    </Wrapper>
  );
}
