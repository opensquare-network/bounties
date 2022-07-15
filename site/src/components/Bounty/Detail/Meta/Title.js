import styled from "styled-components";

import DividerWrapper from "@osn/common-ui/es/styled/DividerWrapper";
import BountyTag from "../../BountyTag";
import { p_18_semibold } from "@osn/common-ui/es/styles/textStyles";
import BigNumber from "bignumber.js";
import BountyLogo from "../../BountyLogo";

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

const Status = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #4caf50;
`;

const Type = styled.div`
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

export default function Title({ bountyDetail }) {
  const decimals = bountyDetail?.bounty?.decimals;
  const value = bountyDetail?.bounty?.value;
  const symbol = bountyDetail?.bounty?.symbol;

  return (
    <Wrapper>
      <BountyLogo
        network={bountyDetail?.network}
        logoUrl={bountyDetail?.logoUrl}
      />
      <TitleText>{bountyDetail.title}</TitleText>
      <div>
        <DividerWrapper>
          {/* TODO: Bind bounty status */}
          <Status>Open</Status>
          <Type>Bounty</Type>
        </DividerWrapper>
        <BountyTag
          value={new BigNumber(value).div(Math.pow(10, decimals)).toFixed()}
          symbol={symbol}
        />
      </div>
    </Wrapper>
  );
}
