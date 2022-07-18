import BountyItem from "./BountyItem";
import styled from "styled-components";
import { MOBILE_SIZE } from "@osn/constants";
import BountyNoData from "./BountyNoData";

const Wrapper = styled.div`
  --gap: 20px;
  --cols: 3;
  --gaps: calc(var(--gap) * calc(var(--cols) - 1));
  gap: var(--gap);
  flex-wrap: wrap;
  display: grid;
  grid-template-columns: repeat(
    var(--cols),
    calc((100% - var(--gaps)) / var(--cols))
  );

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    display: block;
  }
`;

export default function BountyList({ items = [], isLoading = false }) {
  if (isLoading) {
    return (
      <Wrapper>
        <BountyItem.Loading />
      </Wrapper>
    );
  }

  if (!items.length) {
    return <BountyNoData />;
  }

  return (
    <Wrapper>
      {/* TODO: how many in mobile size */}
      {items?.map((item, idx) => (
        <BountyItem key={idx} {...item}></BountyItem>
      ))}
    </Wrapper>
  );
}
