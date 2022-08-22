import { Dot, ExternalLink, LinkIdentityUser } from "@osn/common-ui";
import { MarkdownPreviewer } from "@osn/previewer";
import Ellipsis from "components/Ellipsis";
import {
  IdentityUserWrapper,
  DescriptionWrapper,
  ItemWrapper,
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
    <ItemWrapper>
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
              <Ellipsis>
                <span>Submission</span>
                <Dot />
                <ExternalLink title={link} href={link}>
                  {link}
                </ExternalLink>
              </Ellipsis>
            </DescriptionLinkWrapper>
          )}
        </DescriptionInnerWrapper>
      </DescriptionWrapper>
    </ItemWrapper>
  );
}
