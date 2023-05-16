import InfoItem from "./InfoItem";
import { InfoContent, InfoHeader } from "./styled";
import { ReactComponent as PolkassemblyIcon } from "imgs/icons/polkassembly.svg";
import { ReactComponent as SubSquareIcon } from "imgs/icons/subsquare.svg";
import { ReactComponent as DotreasuryIcon } from "imgs/icons/dotreasury.svg";

export default function InfoRelatedLinks({
  bountyDetail,
  dotreasuryNetwork = bountyDetail?.network === "kusama" ? "ksm" : "dot",
  subsquareUrlPath = "bounty",
  subsquareLink = `https://${bountyDetail?.network}.subsquare.io/treasury/${subsquareUrlPath}/${bountyDetail?.bountyIndex}`,
  dotreasuryUrlPath = "bounties",
  dotreasuryLink = `https://dotreasury.com/${dotreasuryNetwork}/${dotreasuryUrlPath}/${bountyDetail?.bountyIndex}`,
  polkassemblyUrlPath = "bounty",
  polkassemblyLink = `https://${bountyDetail?.network}.polkassembly.io/${polkassemblyUrlPath}/${bountyDetail?.bountyIndex}`,
}) {
  return (
    <InfoItem
      title={<InfoHeader>Related Links</InfoHeader>}
      content={
        <InfoContent>
          <a target="_blank" rel="noreferrer" href={subsquareLink}>
            <SubSquareIcon />
          </a>
          <a target="_blank" rel="noreferrer" href={dotreasuryLink}>
            <DotreasuryIcon />
          </a>
          <a target="_blank" rel="noreferrer" href={polkassemblyLink}>
            <PolkassemblyIcon />
          </a>
        </InfoContent>
      }
    />
  );
}
