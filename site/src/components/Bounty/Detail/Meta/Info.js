import styled from "styled-components";
import InfoItem from "./InfoItem";
import NetworkUser from "components/User/NetworkUser";
import ChainIcon from "@osn/common-ui/es/Chain/ChainIcon";
import FlexCenter from "@osn/common-ui/es/styled/FlexCenter";
import Tooltip from "@osn/common-ui/es/Tooltip";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  column-gap: 24px;
  row-gap: 20px;
  > div {
    width: 230px;
  }
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: #506176;
  gap: 5px;
`;

const InfoContent = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #1E2134;
  gap: 8px;
`;

export default function Info({ bountyDetail }) {
  return (
    <Wrapper>
      <InfoItem
        title={<InfoHeader>Funder</InfoHeader>}
        content={
          <InfoContent>
            <ChainIcon chainName={bountyDetail?.network} />
            <span>Kusama Treasury</span>
          </InfoContent>
        }
      />
      <InfoItem
        title={<InfoHeader>Curator</InfoHeader>}
        content={
          <InfoContent>
            <NetworkUser network={bountyDetail?.network} address={bountyDetail?.bounty?.curators?.[0]} />
          </InfoContent>
        }
      />
      <InfoItem
        title={
          <InfoHeader>
            <span>Bounty ID</span>
            <Tooltip content={`The bounty ID on-chain`} size="fit">
              <div>
                <FlexCenter>
                  <img src="/imgs/icons/question.svg" alt="" />
                </FlexCenter>
              </div>
            </Tooltip>
          </InfoHeader>
        }
        content={<InfoContent>{bountyDetail?.bountyIndex}</InfoContent>}
      />
      <InfoItem
        title={
          <InfoHeader>
            <span>Child Bounties</span>
            <Tooltip content={`0 open child bounties`} size="fit">
              <div>
                <FlexCenter>
                  <img src="/imgs/icons/question.svg" alt="" />
                </FlexCenter>
              </div>
            </Tooltip>
          </InfoHeader>
        }
        content={<InfoContent>{"-"}</InfoContent>}
      />
      <InfoItem
        title={<InfoHeader>Related Links</InfoHeader>}
        content={<InfoContent>{"-"}</InfoContent>}
      />
    </Wrapper>
  );
}
