import { HeadTitle, SubTitle, Head } from "./styled/bounty";

export default function BountyNoData() {
  return (
    <Head>
      <img src="/imgs/icons/no-bounties.svg" alt="" />
      <HeadTitle>No current bounties</HeadTitle>
      <SubTitle>Get started by importing a bounty</SubTitle>
    </Head>
  );
}
