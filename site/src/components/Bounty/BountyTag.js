import { Tag } from "@osn/common-ui";
import ValueDisplay from "@osn/common-ui/es/Chain/ValueDisplay";

const symbolColorMap = {
  KSM: "#000000",
  DOT: "#E6007A",
  OSNT: "purple",
  WND: "linear-gradient(90.04deg, rgba(247, 148, 32, 0.92) 2.41%, rgba(196, 196, 196, 0) 164.5%), #E6007A",
};

const getSymbolColor = (symbol) => symbolColorMap[symbol] || "#000000";

export default function BountyTag(props = {}) {
  const { symbol } = props;

  return (
    <Tag color={getSymbolColor(symbol)}>
      <ValueDisplay {...props} />
    </Tag>
  );
}
