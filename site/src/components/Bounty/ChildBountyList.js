import { List } from "@osn/common-ui";
import { useAsyncState } from "@osn/common";
import { useDispatch, useSelector } from "react-redux";
import {
  childBountyListSelector,
  fetchChildBountyList,
} from "store/reducers/bountySlice";
import ChildBountyItem from "./ChildBountyItem";

export default function ChildBountyList() {
  const dispatch = useDispatch();
  const childBounties = useSelector(childBountyListSelector);

  const { isLoading } = useAsyncState(() => dispatch(fetchChildBountyList()));

  return (
    <List
      gap={20}
      data={childBounties}
      loading={isLoading}
      noDataMessage="No current active bounties"
      itemRender={(item) => (
        <List.Item>
          <ChildBountyItem {...item}>content</ChildBountyItem>
        </List.Item>
      )}
    />
  );
}
