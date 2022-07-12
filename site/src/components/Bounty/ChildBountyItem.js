import styled from "styled-components";
import {
  Card,
  IdentityUser,
  FlexCenter,
  FlexBetween,
  ChainIcon,
} from "@osn/common-ui";
import { p_14_normal } from "@osn/common-ui/es/styles/textStyles";
import { text_dark_accessory } from "@osn/common-ui/es/styles/colors";
import BountyTag from "./BountyTag";

// TODO: this should not defined here
const Mark = styled.span`
  ${p_14_normal};
  color: ${text_dark_accessory};
  margin-right: 8px;
`;

export default function ChildBountyItem({ children, ...props } = {}) {
  const { network, signer, title, bounty } = props ?? {};

  return (
    <Card
      size="small"
      title={title}
      prefix={
        <div>
          <ChainIcon chainName={network} size={64} />
        </div>
      }
    >
      <FlexBetween>
        <FlexCenter>
          <Mark>Curated by</Mark>
          <IdentityUser network={network} address={signer} />
        </FlexCenter>

        <BountyTag {...bounty} />
      </FlexBetween>
    </Card>
  );
}
