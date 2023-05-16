import InfoItem from "./InfoItem";
import { InfoContent, InfoHeader } from "./styled";
import Tooltip from "@osn/common-ui/es/Tooltip";
import { FlexCenter } from "@osn/common-ui";

export default function InfoChildBounties({ bountyDetail }) {
  const { childBounties = [] } = bountyDetail ?? {};
  const count = childBounties.length;

  return (
    <InfoItem
      title={
        <InfoHeader>
          <span>Child Bounties</span>
          <Tooltip content={`${count} open child bounties`} size="fit">
            <div>
              <FlexCenter>
                <img src="/imgs/icons/question.svg" alt="" />
              </FlexCenter>
            </div>
          </Tooltip>
        </InfoHeader>
      }
      content={<InfoContent>{count}</InfoContent>}
    />
  );
}
