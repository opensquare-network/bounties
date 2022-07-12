import { EmptyList } from "utils/constants";
import serverApi from "./serverApi";

export function fetchChildBountyList() {
  serverApi
    .fetch("/child-bounties", {})
    .then(({ result }) => result ?? EmptyList);
}
