import { List } from "@osn/common-ui";
import { useAsyncState } from "utils/hooks";
import ChildBountyItem from "./ChildBountyItem";

// TODO: from server
const mock = {
  cid: "bafybeifbgmeh7kzqk3kgrzozwpm744c5rh7p6ijouyjfvkhksjpjfdbhge",
  bounty: {
    tokenIdentifier: "N",
    symbol: "WND",
    decimals: 12,
    value: "1",
  },
  content: "abcde",
  createdAt: "2022-07-12T03:55:02.802Z",
  indexer: {
    blockHash:
      "0x19dd125ade17179b7588d03633ba0dacbd80a26153b3b37ed96512a0d425e128",
    blockHeight: 11682636,
    extrinsicIndex: 3,
    blockTime: 1657597506002,
  },
  network: "westend",
  resolved: false,
  signer: "5Dw5KnvTs96FaRQFez1Su15XMMJ65QAi4F1ugNBaXUBiGbX6",
  signerPublicKey:
    "52a6c52dc82940a36fefd1474cc0778517bb1a56b7bda0e308b6c19152dd7510",
  status: "published",
  title: "Test ",
  updatedAt: "2022-07-12T03:55:02.802Z",
  answersCount: 0,
  rewards: [
    {
      indexer: {
        blockHash:
          "0x19dd125ade17179b7588d03633ba0dacbd80a26153b3b37ed96512a0d425e128",
        blockHeight: 11682636,
        extrinsicIndex: 3,
        blockTime: 1657597506002,
      },
      bounty: {
        tokenIdentifier: "N",
        symbol: "WND",
        decimals: 12,
        value: "1",
      },
      _id: "62ccef6a814138088cf405db",
      topicCid: "bafybeifbgmeh7kzqk3kgrzozwpm744c5rh7p6ijouyjfvkhksjpjfdbhge",
      createdAt: "2022-07-12T03:50:02.545Z",
      network: "westend",
      sponsor: "5Dw5KnvTs96FaRQFez1Su15XMMJ65QAi4F1ugNBaXUBiGbX6",
      sponsorPublicKey:
        "52a6c52dc82940a36fefd1474cc0778517bb1a56b7bda0e308b6c19152dd7510",
      type: "topic",
      updatedAt: "2022-07-12T03:50:02.545Z",
      id: "62ccef6a814138088cf405db",
    },
  ],
};

export default function ChildBountyList() {
  const { state, isLoading } = useAsyncState(() => Array(5).fill(mock), [], {
    onError() {},
  });

  return (
    <List
      gap={20}
      data={state}
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
