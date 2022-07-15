import { Card, FlexCenter, List } from "@osn/common-ui";
import ValueDisplay from "@osn/common-ui/es/Chain/ValueDisplay";
import Tooltip from "@osn/common-ui/es/Tooltip";
import { Link } from "react-router-dom";
import { Detail, Head, SubTitle, Title } from "./styled/bounty";
import { detailLoading, headLoading } from "./styled/bountyLoading";
import BountyLogo from "./BountyLogo";

function BountyItem(props) {
  const { network, title, bountyIndex, bounty, logoUrl } = props ?? {};

  const details = [
    {
      label: (
        <>
          <div style={{ marginRight: 5 }}>
            <span className="hide-in-mobile">Child </span>
            Bounties
          </div>
          <Tooltip content={`0 open child bounties`} size="fit">
            <div>
              <FlexCenter>
                <img src="/imgs/icons/question.svg" alt="" />
              </FlexCenter>
            </div>
          </Tooltip>
        </>
      ),
      // FIXME: form server
      value: 0,
    },
    {
      label: (
        <div>
          <span className="hide-in-mobile">Total </span>
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
          <BountyLogo network={network} logoUrl={logoUrl} />
          <Title>
            <Link to={`/network/${network}/bounty/${bountyIndex}`}>
              {title}
            </Link>
          </Title>
          <SubTitle>{network} Network</SubTitle>
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
