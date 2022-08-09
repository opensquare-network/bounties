import styled from "styled-components";

import BountyTag from "components/Bounty/BountyTag";
import { p_18_semibold } from "@osn/common-ui/es/styles/textStyles";
import BountyLogo from "components/Bounty/BountyLogo";
import { Dot } from "@osn/common-ui";
import StatusLabel from "components/Bounty/StatusLabel";

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

export default function Title({ childBountyDetail, type }) {
  const { childBounty, parentBounty, status } = childBountyDetail ?? {};

  return (
    <Wrapper>
      <BountyLogo
        network={parentBounty?.network}
        logoUrl={parentBounty?.logoUrl}
      />
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