import { Button } from "@osn/common-ui";

export default function ConnectWallet({ ...props }) {
  return (
    <Button block primary {...props}>
      Connect Wallet
    </Button>
  );
}
