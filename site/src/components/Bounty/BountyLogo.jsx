import styled from "styled-components";

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
  const defaultLogoUrl =
    network === "kusama"
      ? "/imgs/icons/bounty-logo-kusama.svg"
      : "/imgs/icons/bounty-logo-polkadot.svg";

  return (
    <Wrapper>
      <img className="logo" src={logoUrl || defaultLogoUrl} />
    </Wrapper>
  );
}
