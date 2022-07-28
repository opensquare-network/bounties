import { Link } from "react-router-dom";
import { Collapse, List, Button, Time, FlexCenter } from "@osn/common-ui";
import { ReactComponent as Loading } from "imgs/icons/loading.svg";
import BountyTag from "components/Bounty/BountyTag";
import StatusLabel from "components/Bounty/StatusLabel";
import {
  resolveChildBountyDetailRoute,
  resolveImportChildBountyRoute,
} from "utils/route";
import { Index, Item, ListWrapper, Status, TimeWrapper, Title } from "./styled";

export default function ChildBounties({ bountyDetail = {} }) {
  const { childBounties = [], network, bountyIndex } = bountyDetail ?? {};

  return (
    <Collapse title="Child Bounties">
      <ListWrapper>
        <List
          data={childBounties}
          noDataMessage="No current bounties"
          noDataProps={{ bordered: false, shadow: false }}
          loading={!childBounties.length}
          loadingComponent={
            <FlexCenter>
              <Loading />
            </FlexCenter>
          }
          itemRender={(item, idx) => {
            const i = idx + 1;
            const {
              parentBountyIndex,
              network,
              index: childBountyIndex,
            } = item ?? {};

            return (
              <List.Item>
                <Item>
                  <Index>#{i}</Index>

                  <Status>
                    <div>
                      <StatusLabel>{item.status}</StatusLabel>
                    </div>
                    {item.status !== "open" && (
                      <TimeWrapper>
                        <Time time={item.createdAt} />
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
              </List.Item>
            );
          }}
        />
      </ListWrapper>

      <Link
        style={{ display: "flex" }}
        to={resolveImportChildBountyRoute(network, bountyIndex)}
      >
        <Button block>Import a Child Bounty</Button>
      </Link>
    </Collapse>
  );
}
