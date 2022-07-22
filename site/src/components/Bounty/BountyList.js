import BountyItem from "./BountyItem";
import BountyNoData from "./BountyNoData";
import { BountyWrapper, BountyItemWrapper } from "./styled/bounty";

export default function BountyList({ items = [], isLoading = false }) {
  if (isLoading) {
    return (
      <BountyWrapper>
        <BountyItem.Loading />
      </BountyWrapper>
    );
  }

  if (!items.length) {
    return <BountyNoData />;
  }

  return (
    <BountyWrapper>
      {items?.map((item, idx) => (
        <BountyItemWrapper key={idx}>
          <BountyItem {...item}></BountyItem>
        </BountyItemWrapper>
      ))}
    </BountyWrapper>
  );
}
