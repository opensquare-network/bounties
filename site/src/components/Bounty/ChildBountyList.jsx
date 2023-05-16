import { List } from "@osn/common-ui";
import ChildBountyItem from "./ChildBountyItem";

export default function ChildBountyList({ items = [], isLoading = false }) {
  return (
    <List
      gap={20}
      data={items}
      loading={isLoading}
      noDataMessage="No current active bounties"
      itemRender={(item) => (
        <List.Item>
          <ChildBountyItem {...item} />
        </List.Item>
      )}
    />
  );
}
