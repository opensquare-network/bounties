import styled from "styled-components";

import BountyTag from "@/components/Bounty/BountyTag";
import { p_18_semibold } from "@osn/common-ui";
import BountyLogo from "@/components/Bounty/BountyLogo";
import { Dot, FlexBetween, p_14_medium, Select } from "@osn/common-ui";
import StatusLabel from "@/components/Bounty/StatusLabel";
import { useIsCurator } from "@/hooks/useIsCurator";
import { CHILD_BOUNTY_CURATOR_VIEWS } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  childBountyDetailCuratorViewSelector,
  setChildBountyDetailCuratorView,
} from "@/store/reducers/childBountyDetailSlice";

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

const SelectContent = styled.span`
  ${p_14_medium}
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
        content: <SelectContent>{view}</SelectContent>,
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
          <Select
            width={136}
            size="small"
            value={curatorView}
            options={dropdownOptions}
            onSelect={(value) => {
              dispatch(setChildBountyDetailCuratorView(value));
            }}
          />
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
