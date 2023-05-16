import styled, { css } from "styled-components";

import { Container, FlexBetween, FlexCenter } from "@osn/common-ui";
import Background from "components/Background";
import { MOBILE_SIZE } from "@osn/constants";
import {
  h3_36_bold,
  p_16_semibold,
  p_20_semibold,
  h5_24_bold,
} from "@osn/common-ui/es/styles/textStyles";
import ChildBountyList from "components/Bounty/ChildBountyList";
import BountyList from "components/Bounty/BountyList";
import { Link } from "react-router-dom";
import { text_dark_minor } from "@osn/common-ui/es/styles/colors";
import { useDispatch } from "react-redux";
import {
  fetchBountyList,
  fetchChildBountyList,
} from "store/reducers/bountySlice";
import { useAsyncState } from "@osn/common";
import { useMemo } from "react";
import { EmptyList } from "utils/constants";
import SEO from "components/SEO";

const Wrapper = styled.div`
  position: relative;
  @media screen and (max-width: ${MOBILE_SIZE}px) {
    padding-top: 20px;
  }
`;

const BountiesWrapper = styled.div`
  position: relative;
  padding-top: 40px;

  ${(p) =>
    p.bg &&
    css`
      border-bottom: solid 1px #f0f3f8;
      background-color: #ffffff;
      padding-bottom: 40px;
    `}
`;

const ChildBountiesWrapper = styled.div`
  margin-top: 24px;
  margin-bottom: 64px;
`;

const Title = styled.h3`
  margin-bottom: 0;
  ${h3_36_bold};

  @media screen and (max-width: ${MOBILE_SIZE}px) {
    ${h5_24_bold};
  }
`;

const SubTitle = styled.p`
  ${p_20_semibold}
`;

const ImportLink = styled(Link)`
  ${p_16_semibold};
  color: ${text_dark_minor};
  cursor: pointer;

  img {
    margin-right: 12.27px;
  }
`;

const BountyListWrapper = styled.div`
  margin-top: 20px;
`;

export default function Home() {
  const dispatch = useDispatch();
  const { state: bountyListState, isLoading: bountyListLoading } =
    useAsyncState(() => dispatch(fetchBountyList()), EmptyList);

  const bountyList = useMemo(
    () => bountyListState?.payload?.items || [],
    [bountyListState?.payload?.items],
  );

  const { state: childBountyListState, isLoading: childBountyListLoading } =
    useAsyncState(() => dispatch(fetchChildBountyList()), EmptyList);

  return (
    <Wrapper>
      <SEO />

      {(bountyListLoading || !!bountyList.length) && <Background />}

      <BountiesWrapper bg={!bountyListLoading && !bountyList.length}>
        <Container>
          <FlexBetween>
            <Title>Bounties</Title>
            <ImportLink to="/import_bounty">
              <FlexCenter>
                <img src="/imgs/icons/add.svg" alt="" />
                <span>Import a Bounty</span>
              </FlexCenter>
            </ImportLink>
          </FlexBetween>

          <BountyListWrapper>
            <BountyList isLoading={bountyListLoading} items={bountyList} />
          </BountyListWrapper>
        </Container>
      </BountiesWrapper>

      <ChildBountiesWrapper>
        <Container>
          <SubTitle>Child Bounties</SubTitle>

          <ChildBountyList
            isLoading={childBountyListLoading}
            items={childBountyListState?.payload?.items}
          />
        </Container>
      </ChildBountiesWrapper>
    </Wrapper>
  );
}
