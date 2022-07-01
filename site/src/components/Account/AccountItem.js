import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import Avatar from "@osn/common-ui/es/Account/Avatar";
import Address from "@osn/common-ui/es/Account/Address";
import { encodeAddress } from "@polkadot/util-crypto";
import { ChainSS58Format, identityChainMap } from "@osn/consts";
import { fetchIdentity } from "@osn/common/src/services/identity";
import IdentityIcon from "@osn/common-ui/es/Identity/IdentityIcon";
import { p_16_semibold } from "@osn/common-ui/es/styles/textStyles";
import ChainIcon from "@osn/common-ui/es/Chain/ChainIcon";

const Text = styled.p`
  color: #1e2134;
  margin: 0;
`;

const TextMinor = styled(Text)`
  color: #9da9bb;
`;

const ItemWrapper = styled.div`
  height: 64px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  & > div:first-child {
    margin-right: 16px;
  }
  ${(p) =>
    p.header &&
    css`
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      pointer-events: none;
    `}
`;

const IdentityWrapper = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;

  > :not(:first-child) {
    margin-left: 4px;
  }
`;

const IdentityName = styled.span`
  ${p_16_semibold};
`;

const IdentityDisplay = ({ identity, displayAccountName, chain }) => {
  return identity?.info && identity?.info?.status !== "NO_ID" ? (
    <IdentityWrapper>
      <ChainIcon chainName={chain} size={16} />
      <IdentityIcon status={identity.info.status} size={12} />
      <IdentityName>{identity.info.display}</IdentityName>
    </IdentityWrapper>
  ) : (
    <>{displayAccountName}</>
  );
};

const AccountItem = ({ header, accountName, accountAddress, chain }) => {
  const [identity, setIdentity] = useState();
  const ss58Format = ChainSS58Format[chain];
  let address = accountAddress;
  if (typeof ss58Format === "number") {
    address = encodeAddress(accountAddress, ss58Format);
  }
  let displayAccountName = accountName;
  useEffect(() => {
    const identityChain = identityChainMap[chain] || chain;
    fetchIdentity(identityChain, accountAddress).then((identity) => {
      setIdentity(identity);
    });
  }, [accountAddress, chain]);

  return (
    <ItemWrapper header={header}>
      <Avatar address={accountAddress} size={40} />
      <div>
        <IdentityDisplay
          identity={identity}
          displayAccountName={displayAccountName}
          chain={chain}
        />
        <TextMinor>
          <Address>{address}</Address>
        </TextMinor>
      </div>
    </ItemWrapper>
  );
};

export default AccountItem;
