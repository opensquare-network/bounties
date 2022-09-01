import { Card, FlexCenter, Gap, List, OnlyDesktop } from "@osn/common-ui";
import ValueDisplay from "@osn/common-ui/es/Chain/ValueDisplay";
import Tooltip from "@osn/common-ui/es/Tooltip";
import { Link } from "react-router-dom";
import { Detail, Head, HeadLogo, SubTitle, HeadTitle } from "./styled/bounty";
import { detailLoading, headLoading } from "./styled/bountyLoading";
import BountyLogo from "./BountyLogo";
import { capitalize } from "utils";
import { resolveBountyDetailRoute } from "utils/route";

function BountyItem(props) {
  const { network, title, bountyIndex, bounty, logoUrl, childBountiesCount } =
    props ?? {};

  const details = [
    {
      label: (
        <>
          <div>
            <OnlyDesktop>Child </OnlyDesktop>
            Bounties
          </div>
          <Gap mr={5} />
          <Tooltip
            content={`${childBountiesCount} open child bounties`}
            size="fit"
          >
            <div>
              <FlexCenter>
                <img src="/imgs/icons/question.svg" alt="" />
              </FlexCenter>
            </div>
          </Tooltip>
        </>
      ),
      value: childBountiesCount,
    },
    {
      label: (
        <div>
          <OnlyDesktop>Total </OnlyDesktop>
          Rewards
        </div>
      ),
      value: <ValueDisplay {...bounty} />,
    },
  ];

  return (
    <Card
      size="small"
      head={
        <Head>
          <HeadLogo>
            <Link to={resolveBountyDetailRoute(network, bountyIndex)}>
              <BountyLogo network={network} logoUrl={logoUrl} />
            </Link>
          </HeadLogo>

          <HeadTitle title={title}>
            <Link to={resolveBountyDetailRoute(network, bountyIndex)}>
              {title}
            </Link>
          </HeadTitle>
          <SubTitle>{capitalize(network)} Network</SubTitle>
        </Head>
      }
    >
      <List
        data={details}
        itemRender={(item) => (
          <List.Item>
            <Detail>
              <FlexCenter>{item.label}</FlexCenter>
              <FlexCenter>{item.value}</FlexCenter>
            </Detail>
          </List.Item>
        )}
      />
    </Card>
  );
}

function Loading() {
  return (
    <Card size="small" head={<Head>{headLoading}</Head>}>
      <List
        data={["", ""]}
        itemRender={() => <List.Item>{detailLoading}</List.Item>}
      />
    </Card>
  );
}

BountyItem.Loading = Loading;

export default BountyItem;
