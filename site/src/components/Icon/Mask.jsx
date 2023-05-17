import styled from "styled-components";

const I = styled.i`
  mask: url(${(p) => p.src}) no-repeat center;
  mask-size: cover;
`;

export default function IconMask({ src, className }) {
  return <I role="img" className={className} src={src} />;
}
