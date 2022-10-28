import styled from "styled-components";

import BountyTag from "components/Bounty/BountyTag";
import { p_18_semibold } from "@osn/common-ui/es/styles/textStyles";
import BountyLogo from "components/Bounty/BountyLogo";
import {
  Dot,
  FlexBetween,
  Dropdown as DropdownOrigin,
  FlexCenter,
} from "@osn/common-ui";
import StatusLabel from "components/Bounty/StatusLabel";
import { useIsCurator } from "hooks/useIsCurator";
import { CHILD_BOUNTY_CURATOR_VIEWS } from "utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  childBountyDetailCuratorViewSelector,
  setChildBountyDetailCuratorView,
} from "store/reducers/childBountyDetailSlice";

// FIXME:hard to make a small size
// see https://github.com/opensquare-network/ui/issues/69
// see https://github.com/opensquare-network/bounties/issues/242
const DropdownWrapper = styled.div`
  position: relative;
  height: 38px;
`;
const Dropdown = styled(DropdownOrigin)`
  height: 38px !important;

  & .menu .item {
    user-select: none;
  }
`;
const DropdownSelectedItem = styled(FlexCenter)`
  position: absolute;
  top: 0;
  left: 0;
  padding: 4px 16px;
  pointer-events: none;
  height: inherit;
  z-index: 999;
`;

const Wrapper = styled.div`
  > :nth-child(1) {
    margin-bottom: 20px;
  }
  > :nth-child(2) {
    ${p_18_semibold};
  }
  > :nth-child(3) {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const Type = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #a1a8b3;
`;

const TitleText = styled.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
  color: #1e2134;
`;

const LogoWrapper = styled(FlexBetween)`
  align-items: flex-start;
`;

export default function Title({ childBountyDetail, type }) {
  const dispatch = useDispatch();

  const { childBounty, parentBounty, status } = childBountyDetail ?? {};
  const { curators = [] } = childBounty ?? {};

  const curatorView = useSelector(childBountyDetailCuratorViewSelector);
  const isCurator = useIsCurator(curators);

  const dropdownOptions = Object.values(CHILD_BOUNTY_CURATOR_VIEWS).map(
    (view) => {
      return {
        id: view,
        content: view,
        value: view,
      };
    },
  );

  return (
    <Wrapper>
      <LogoWrapper>
        <BountyLogo
          network={parentBounty?.network}
          logoUrl={parentBounty?.logoUrl}
        />

        {isCurator && (
          <DropdownWrapper>
            <Dropdown
              selection
              options={dropdownOptions}
              onChange={(_, { value }) => {
                dispatch(setChildBountyDetailCuratorView(value));
              }}
              value={curatorView}
            />
            <DropdownSelectedItem>{curatorView}</DropdownSelectedItem>
          </DropdownWrapper>
        )}
      </LogoWrapper>
      <TitleText>{childBountyDetail.title}</TitleText>
      <div>
        <span>
          <StatusLabel>{status}</StatusLabel>
          <Dot />
          <Type>{type}</Type>
        </span>

        <BountyTag {...childBounty} />
      </div>
    </Wrapper>
  );
}
