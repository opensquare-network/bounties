import { Card, Divider, Button, Flex } from "@osn/common-ui";
import Description from "components/Bounty/Detail/Meta/Description";
import Title from "components/Bounty/Detail/Meta/Title";
import {
  descriptionLoading,
  metaLoading,
} from "components/Bounty/styled/metaLoading";
import { ButtonGroup } from "./styled";

export default function ChildBountyDetailMeta({ childBountyDetail }) {
  if (!childBountyDetail) {
    return <Card head={metaLoading}>{descriptionLoading}</Card>;
  }

  const { childBounty } = childBountyDetail ?? {};

  return (
    <Card
      head={
        <Title bountyDetail={{ ...childBountyDetail, bounty: childBounty }} />
      }
    >
      <Description bountyDetail={childBountyDetail} />

      <Divider />

      <ButtonGroup>
        <Flex>
          <Button block primary isLoading>
            Collecting Applications
          </Button>
          <Button>Delete</Button>
        </Flex>
      </ButtonGroup>
    </Card>
  );
}
