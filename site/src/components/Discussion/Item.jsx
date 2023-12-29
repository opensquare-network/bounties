import styled from "styled-components";

import DividerWrapper from "@osn/common-ui/es/styled/DividerWrapper";
import Time from "@osn/common-ui/es/Time";
import IpfsSquare from "@osn/common-ui/es/IpfsSquare";
import NetworkUser from "@/components/User/NetworkUser";
import { encodeNetworkAddress } from "@osn/common";
import { p_14_normal } from "@osn/common-ui";
import FlexBetween from "@osn/common-ui/es/styled/FlexBetween";
import {
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import { MentionIdentityUser } from "@osn/common-ui";
import ActionBar from "./ActionBar";

const ContentWrapper = styled.div`
  margin: 8px 0 0 28px;
  padding-bottom: 20px;
  border-bottom: solid 1px var(--strokeBorderDefault);
  > :first-child {
    ${p_14_normal};
  }
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const Height = styled.span`
  ${p_14_normal};
  color: #a1a8b3;
`;

export default function Item({ comment, height, onReply }) {
  const signerAddress = encodeNetworkAddress(
    comment.address,
    comment.commenterNetwork,
  );
  return (
    <div>
      <FlexBetween>
        <DividerWrapper>
          <NetworkUser
            address={signerAddress}
            network={comment.commenterNetwork}
            tooltipPosition="down"
          />
          <Time time={comment.createdAt} />
        </DividerWrapper>
        <DividerWrapper>
          <Height>#{height}</Height>
          <IpfsSquare
            href={
              comment.pinHash
                ? `https://ipfs.infura.io/ipfs/${comment.pinHash}`
                : null
            }
          />
        </DividerWrapper>
      </FlexBetween>
      <ContentWrapper>
        <MarkdownPreviewer
          content={comment.content}
          plugins={[
            renderMentionIdentityUserPlugin(<MentionIdentityUser hashRoute />),
          ]}
        />
        <ActionBar
          network={comment.commenterNetwork}
          address={comment.address}
          onReply={onReply}
        />
      </ContentWrapper>
    </div>
  );
}
