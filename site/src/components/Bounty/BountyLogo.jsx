import styled from "styled-components";
import { ReactComponent as KusamaLogoIcon } from "imgs/icons/bounty-logo-kusama.svg";
import { ReactComponent as PolkadotLogoIcon } from "imgs/icons/bounty-logo-polkadot.svg";

const Wrapper = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border: 1px solid #d2d9e2;
  border-radius: 50%;
  background: #f0f3f8;
  overflow: hidden;

  img.logo {
    width: 100%;
    height: 100%;
  }
`;

export default function Logo({ network, logoUrl }) {
  const defaultLogo =
    network === "kusama" ? <KusamaLogoIcon /> : <PolkadotLogoIcon />;

  return (
    <Wrapper>
      {logoUrl ? <img className="logo" src={logoUrl} alt="" /> : defaultLogo}
    </Wrapper>
  );
}
