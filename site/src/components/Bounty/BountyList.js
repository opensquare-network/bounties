import { useDispatch } from "react-redux";
import { fetchBountyList } from "store/reducers/bountySlice";
import { useAsyncState } from "@osn/common";
import BountyItem from "./BountyItem";
import styled from "styled-components";
import { MOBILE_SIZE } from "@osn/constants";

const Wrapper = styled.div`
  gap: 20px;
  flex-wrap: wrap;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    display: block;
  }
`;

export default function BountyList() {
  const dispatch = useDispatch();

  const {
    state: { payload },
    isLoading,
  } = useAsyncState(() => dispatch(fetchBountyList()), {});

  return isLoading ? (
    <Wrapper>
      <BountyItem.Loading />
    </Wrapper>
  ) : (
    <Wrapper>
      {/* TODO: how many in mobile size */}
      {payload?.items?.map?.((item, idx) => (
        <BountyItem key={idx} {...item}></BountyItem>
      ))}
    </Wrapper>
  );
}
