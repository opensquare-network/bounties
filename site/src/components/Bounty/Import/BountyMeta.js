import { useSelector } from "react-redux";
import { accountSelector } from "store/reducers/accountSlice";

import styled from "styled-components";
import ChainIcon from "@osn/common-ui/es/Chain/ChainIcon";
import { ReactComponent as NetworkIcon } from "imgs/icons/network.svg";
import { ReactComponent as RewardIcon } from "imgs/icons/treasury.svg";
import { ReactComponent as InfoIcon } from "imgs/icons/info.svg";
import { ReactComponent as Loading } from "imgs/icons/loading.svg";
import {
  p_14_medium,
  p_16_semibold,
} from "@osn/common-ui/es/styles/textStyles";
import FlexBetween from "@osn/common-ui/es/styled/FlexBetween";
import { LinkIdentityUser } from "@osn/common-ui";
import { ErrorMessage } from "./styled";
import BigNumber from "bignumber.js";
import { encodeNetworkAddress } from "@osn/common/src";

const StyledText = styled.p`
  ${p_16_semibold};
  color: #1e2134;
  margin-bottom: 0px !important;
`;

const Text = styled.p`
  ${p_14_medium};
  text-transform: capitalize;
  color: #1e2134;
  margin: 0;
`;

const DisabledText = styled(Text)`
  color: #a1a8b3;
`;

const FieldBox = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;

  height: 48px;

  background: #fbfcfe;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;

  > :first-child {
    margin-right: 8px;
  }

  > :nth-child(2) {
    flex-grow: 1;
  }
`;

const CuratorsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 12px 16px;

  min-height: 48px;
  max-width: 236px;

  background: #fbfcfe;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;

  a {
    cursor: pointer;
  }
`;

const CuratorItem = styled.div`
  display: flex;
  align-items: center;

  > :first-child {
    margin-right: 8px;
  }

  > :nth-child(2) {
    flex-grow: 1;
  }
`;

const Signatories = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
  > span {
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: #a1a8b3;
  }
`;

const SignatoriesDivider = styled.div`
  flex-grow: 1;
  display: inline-block;
  height: 1px;
  background: #f0f3f8;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;

  > :first-child {
    margin-bottom: 16px;
  }
  gap: 16px;
`;

const SubField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldTitle = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #1e2134;
`;

export default function BountyMeta({
  value,
  symbol,
  decimals,
  curators = [],
  loading,
}) {
  const account = useSelector(accountSelector);
  const encodedAddress =
    account?.address &&
    encodeNetworkAddress(account?.address, account?.network);
  const multisigCurators = curators.slice(1);

  const isCurator = encodedAddress && curators.includes(encodedAddress);

  return (
    <>
      <Field>
        <FlexBetween>
          <StyledText>Network</StyledText>
          <NetworkIcon />
        </FlexBetween>
        <FieldBox>
          <ChainIcon chainName={account?.network} />
          <Text>{account?.network}</Text>
        </FieldBox>
      </Field>
      <Field>
        <FlexBetween>
          <StyledText>Information</StyledText>
          <InfoIcon />
        </FlexBetween>
        <SubField>
          <FieldTitle>Funder</FieldTitle>
          <FieldBox>
            <ChainIcon chainName={account?.network} />
            <Text>{account?.network} Treasury</Text>
          </FieldBox>
        </SubField>
        <SubField>
          <FieldTitle>Curator</FieldTitle>
          {curators?.length > 0 ? (
            <>
              <CuratorsList>
                <CuratorItem>
                  <LinkIdentityUser
                    explore
                    network={account?.network}
                    address={curators[0]}
                  />
                </CuratorItem>
                {multisigCurators?.length > 0 && (
                  <>
                    <Signatories>
                      <span>Signatories</span>
                      <SignatoriesDivider />
                    </Signatories>
                    {multisigCurators.map((curator) => (
                      <CuratorItem key={curator}>
                        <LinkIdentityUser
                          explore
                          network={account?.network}
                          address={curator}
                        />
                      </CuratorItem>
                    ))}
                  </>
                )}
              </CuratorsList>
              {!isCurator && (
                <ErrorMessage>
                  Only bounty curator can import this bounty.
                </ErrorMessage>
              )}
            </>
          ) : (
            <FieldBox>
              <img
                width="20px"
                height="20px"
                src="/imgs/icons/default-avatar.png"
                alt=""
              />
              <DisabledText>{"--"}</DisabledText>
              {loading && <Loading />}
            </FieldBox>
          )}
        </SubField>
      </Field>
      <Field>
        <FlexBetween>
          <StyledText>Bounty</StyledText>
          <RewardIcon />
        </FlexBetween>
        <FieldBox>
          <ChainIcon chainName={account?.network} />
          {value ? (
            <Text>
              {new BigNumber(value).div(Math.pow(10, decimals)).toFixed()}{" "}
              {symbol}
            </Text>
          ) : (
            <DisabledText>
              {"0.00 "}
              {symbol}
            </DisabledText>
          )}
          {loading && <Loading />}
        </FieldBox>
      </Field>
    </>
  );
}
