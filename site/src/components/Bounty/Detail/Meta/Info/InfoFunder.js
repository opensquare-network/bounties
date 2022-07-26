import InfoItem from "./InfoItem";
import { InfoContent, InfoHeader } from "./styled";
import { ChainIcon } from "@osn/common-ui";
import { capitalize } from "utils";

export default function InfoFunder({ bountyDetail }) {
  return (
    <InfoItem
      title={<InfoHeader>Funder</InfoHeader>}
      content={
        <InfoContent>
          <ChainIcon chainName={bountyDetail?.network} />
          <span>{capitalize(bountyDetail?.network)} Treasury</span>
        </InfoContent>
      }
    />
  );
}
