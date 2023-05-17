import InfoItem from "./InfoItem";
import { InfoContent, InfoHeader } from "./styled";
import { FlexCenter } from "@osn/common-ui";
import Tooltip from "@osn/common-ui/es/Tooltip";

export default function InfoBountyId({ bountyDetail }) {
  return (
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
  );
}
