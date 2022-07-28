import { Card, Divider, Button, Flex } from "@osn/common-ui";
import Description from "components/Bounty/Detail/Meta/Description";
import Share from "components/Bounty/Detail/Meta/Share";
import Title from "components/Bounty/Detail/Meta/Title";
import {
  descriptionLoading,
  metaLoading,
} from "components/Bounty/styled/metaLoading";
import Info from "./Info";
import { ButtonGroup, Group } from "./styled";

export default function ChildBountyDetailMeta({ childBountyDetail, type }) {
  if (!childBountyDetail) {
    return <Card head={metaLoading}>{descriptionLoading}</Card>;
  }

  const { childBounty } = childBountyDetail ?? {};

  return (
    <Card
      head={
        <Title
          type={type}
          bountyDetail={{ ...childBountyDetail, bounty: childBounty }}
        />
      }
    >
      <Info childBountyDetail={childBountyDetail} />

      <Divider />

      <Description bountyDetail={childBountyDetail} />

      <Divider />

      <Group>
        <Share />
      </Group>

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
