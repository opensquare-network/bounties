import InfoItem from "./InfoItem";
import { InfoContent, InfoHeader } from "./styled";

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
            <img src="/imgs/icons/subsquare.svg" />
          </a>
          <a target="_blank" rel="noreferrer" href={dotreasuryLink}>
            <img src="/imgs/icons/dotreasury.svg" />
          </a>
          <a target="_blank" rel="noreferrer" href={polkassemblyLink}>
            <img src="/imgs/icons/polkassembly.svg" />
          </a>
        </InfoContent>
      }
    />
  );
}
