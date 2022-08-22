import { Link } from "react-router-dom";
import {
  Collapse,
  List,
  Button,
  Time,
  FlexCenter,
  LoadingIcon,
  Dot,
  Flex,
  FlexBetween,
} from "@osn/common-ui";
import BountyTag from "components/Bounty/BountyTag";
import StatusLabel from "components/Bounty/StatusLabel";
import {
  resolveChildBountyDetailRoute,
  resolveImportChildBountyRoute,
} from "utils/route";
import {
  Index,
  IndexWrapper,
  Item,
  ListWrapper,
  MobileTitleGap,
  Status,
  TimeWrapper,
  Title,
} from "./styled";
import { BOUNTY_STATUS } from "utils/constants";
import { useBountyPermission } from "hooks/useBountyPermission";
import { useIsScreen } from "hooks/useIsScreen";

export default function ChildBounties({ bountyDetail = {} }) {
  const {
    status,
    childBounties = [],
    network,
    bountyIndex,
  } = bountyDetail ?? {};
  const { canImportChildBounty } = useBountyPermission(bountyDetail);

  const { isDesktop } = useIsScreen();

  return (
    <Collapse title="Child Bounties">
      <ListWrapper>
        <List
          data={childBounties}
          noDataMessage="No current bounties"
          noDataProps={{ bordered: false, shadow: false }}
          loading={!bountyDetail}
          loadingComponent={
            <FlexCenter>
              <LoadingIcon />
            </FlexCenter>
          }
          itemRender={(item, idx) => {
            const i = idx + 1;

            return (
              <List.Item>
                {isDesktop ? (
                  <DesktopListItem item={item} i={i} />
                ) : (
                  <MobileListItem item={item} i={i} />
                )}
              </List.Item>
            );
          }}
        />
      </ListWrapper>

      {status === BOUNTY_STATUS.Open && canImportChildBounty && (
        <Link
          style={{ display: "flex" }}
          to={resolveImportChildBountyRoute(network, bountyIndex)}
        >
          <Button block>Import a Child Bounty</Button>
        </Link>
      )}
    </Collapse>
  );
}

function DesktopListItem({ item, i }) {
  const { parentBountyIndex, network, index: childBountyIndex } = item ?? {};

  return (
    <Item>
      <IndexWrapper>
        <Index>#{i}</Index>
      </IndexWrapper>

      <Status>
        <div>
          <StatusLabel>{item.status}</StatusLabel>
        </div>
        {item.status !== "open" && (
          <TimeWrapper>
            <Time time={item.updatedAt} />
          </TimeWrapper>
        )}
      </Status>

      <Title>
        <Link
          to={resolveChildBountyDetailRoute(
            network,
            parentBountyIndex,
            childBountyIndex,
          )}
        >
          {item.title}
        </Link>
      </Title>

      <BountyTag {...item.childBounty} />
    </Item>
  );
}

function MobileListItem({ item, i }) {
  const { parentBountyIndex, network, index: childBountyIndex } = item ?? {};

  return (
    <>
      <FlexBetween>
        <Flex>
          <Index>#{i}</Index>
          <Dot />
          <StatusLabel>{item.status}</StatusLabel>

          {item.status !== "open" && (
            <>
              <Dot />
              <Time time={item.updatedAt} />
            </>
          )}
        </Flex>

        <BountyTag {...item.childBounty} />
      </FlexBetween>

      <MobileTitleGap />

      <Title>
        <Link
          to={resolveChildBountyDetailRoute(
            network,
            parentBountyIndex,
            childBountyIndex,
          )}
        >
          {item.title}
        </Link>
      </Title>
    </>
  );
}
