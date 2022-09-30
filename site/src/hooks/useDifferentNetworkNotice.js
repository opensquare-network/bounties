import { isSamePublicKey } from "@osn/common";
import { Notification, text_dark_minor } from "@osn/common-ui";
import { MarkdownPreviewer } from "@osn/previewer";
import { capitalize } from "lodash";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useAccount } from "./useAccount";

const Message = styled.div`
  ul {
    color: ${text_dark_minor};
    margin: 0;
  }
`;

/**
 * @description To check a network is same as current account network
 */
export function useDifferentNetworkNotice(network = "", curators = []) {
  const account = useAccount();

  const isDifferentNetwork = useMemo(
    () => network !== account?.network,
    [network, account?.network],
  );
  const isSameNetwork = useMemo(
    () => !isDifferentNetwork,
    [isDifferentNetwork],
  );

  const [displayNotice, setDisplayNotice] = useState(false);

  const isCurator = account && curators.some(curator => isSamePublicKey(curator, account.address));

  useEffect(() => setDisplayNotice(true), [account?.network]);

  const noticeEl = account && displayNotice && (
    <Notification
      type="warning"
      size="large"
      onClose={() => setDisplayNotice(false)}
      message={
        <Message>
          <MarkdownPreviewer
            content={[
              `- You are currently on ${capitalize(
                account?.network || "",
              )} network.`,
              `- Switch to right network if you want to ${isCurator ? "manage" : "apply"} this bounty.`,
            ].join("\n")}
          />
        </Message>
      }
    />
  );

  const importNoticeEl = account && displayNotice && (
    <Notification
      type="warning"
      size="large"
      onClose={() => setDisplayNotice(false)}
      message={
        <Message>
          <MarkdownPreviewer
            content={[
              `- You are currently on ${capitalize(
                account?.network || "",
              )} network.`,
              `- Switch to other network if you want to import bounties on it.`,
              `- Only bounty curators can import bounties`,
            ].join("\n")}
          />
        </Message>
      }
    />
  );

  return {
    isDifferentNetwork,
    isSameNetwork,
    noticeEl,
    importNoticeEl,
  };
}
