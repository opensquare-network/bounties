import { FlexCenter } from "@osn/common-ui";
import Tooltip from "@osn/common-ui/es/Tooltip";
import InfoItem from "@/components/Bounty/Detail/Meta/Info/InfoItem";
import {
  InfoContent,
  InfoHeader,
} from "@/components/Bounty/Detail/Meta/Info/styled";

export default function InfoChildBountyId({ childBountyDetail }) {
  return (
    <InfoItem
      title={
        <InfoHeader>
          <span>Child Bounty ID</span>
          <Tooltip content={`The child bounty ID on-chain`} size="fit">
            <div>
              <FlexCenter>
                <img src="/imgs/icons/question.svg" alt="" />
              </FlexCenter>
            </div>
          </Tooltip>
        </InfoHeader>
      }
      content={<InfoContent>{childBountyDetail?.index}</InfoContent>}
    />
  );
}
