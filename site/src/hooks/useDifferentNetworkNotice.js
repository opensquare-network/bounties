import { Notification } from "@osn/common-ui";
import { MarkdownPreviewer } from "@osn/previewer";
import { capitalize } from "lodash";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useAccount } from "./useAccount";

const Message = styled.div`
  ul {
    margin: 0;
  }
`;

/**
 * @description To check a network is same as current account network
 */
export function useDifferentNetworkNotice(network = "") {
  const account = useAccount();

  const isDifferentNetwork = useMemo(
    () => network !== account?.network,
    [network, account?.network],
  );
  const isSameNetwork = useMemo(
    () => !isDifferentNetwork,
    [isDifferentNetwork],
  );

  const [displayNotice, setDisplayNotice] = useState(true);

  useEffect(() => setDisplayNotice(true), [account?.network]);

  const noticeEl = displayNotice && (
    <Notification
      type="notice"
      size="large"
      onClose={() => setDisplayNotice(false)}
      message={
        <Message>
          <MarkdownPreviewer
            content={`- You are currently on [${capitalize(
              account?.network || "",
            )}] network.\n- Switch to right network if you want to manage this bounty.`}
          />
        </Message>
      }
    />
  );

  return {
    isDifferentNetwork,
    isSameNetwork,
    noticeEl,
  };
}
