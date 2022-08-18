import { Dot, ExternalLink, LinkIdentityUser } from "@osn/common-ui";
import { MarkdownPreviewer } from "@osn/previewer";
import {
  IdentityUserWrapper,
  DescriptionWrapper,
  ActionWrapper,
  Wrapper,
  DescriptionLinkWrapper,
  DescriptionInnerWrapper,
} from "./styled";

export default function SubmissionItem({
  network,
  address,
  description,
  link,
}) {
  return (
    <Wrapper>
      <IdentityUserWrapper>
        <LinkIdentityUser
          items={["avatarIcon", "networkIcon", "identityIcon", "text"]}
          network={network}
          address={address}
        />
      </IdentityUserWrapper>

      <DescriptionWrapper>
        <DescriptionInnerWrapper>
          <MarkdownPreviewer
            content={description}
            allowedTags={["a"]}
            maxLines={3}
          />

          {link && (
            <DescriptionLinkWrapper>
              <span>Submission</span>
              <Dot />
              <ExternalLink href={link}>{link}</ExternalLink>
            </DescriptionLinkWrapper>
          )}
        </DescriptionInnerWrapper>
      </DescriptionWrapper>

      <ActionWrapper>{link}</ActionWrapper>
    </Wrapper>
  );
}
