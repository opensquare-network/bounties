import { Title, SubTitle, Head } from "./styled/bounty";

export default function BountyNoData() {
  return (
    <Head>
      <img src="/imgs/icons/no-bounties.svg" alt="" />
      <Title>No current bounties</Title>
      <SubTitle>Get started by importing a bounty</SubTitle>
    </Head>
  );
}
