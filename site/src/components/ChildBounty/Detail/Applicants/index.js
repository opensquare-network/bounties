import {
  Card,
  LinkIdentityUser,
  List,
  Time,
  FlexCenter,
  Dot,
  LoadingIcon,
  Button,
} from "@osn/common-ui";
import StatusLabel from "components/Bounty/StatusLabel";
import { useAccount } from "hooks/useAccount";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { APPLICATION_STATUS } from "utils/constants";
import { findUnassignableApplicant } from "../Meta/actions/utils";
import {
  DescriptionWrapper,
  IdentityUserWrapper,
  ActionWrapper,
  Wrapper,
  Count,
  ActionTimeWrapper,
} from "./styled";

export default function ChildBountyApplicants({ childBountyDetail }) {
  const { applications = [], childBounty } = childBountyDetail ?? {};
  const { curators = [] } = childBounty ?? {};
  const account = useAccount();

  const isCurator = curators.includes(account?.encodedAddress);
  const { assignService } = useWorkflowActionService(childBountyDetail);

  const unassignableApplicant = findUnassignableApplicant(applications);

  return (
    <Card
      title={
        <>
          Applicants
          {!!applications?.length && (
            <>
              <Dot />
              <Count>{applications.length}</Count>
            </>
          )}
        </>
      }
    >
      <List
        data={applications}
        noDataMessage="No current applicants"
        noDataProps={{ bordered: false, shadow: false }}
        loading={!childBountyDetail}
        loadingComponent={
          <FlexCenter>
            <LoadingIcon />
          </FlexCenter>
        }
        itemRender={(applicant) => {
          const { address, bountyIndexer = {}, description } = applicant;

          return (
            <List.Item>
              <Wrapper>
                <IdentityUserWrapper>
                  <LinkIdentityUser
                    items={[
                      "avatarIcon",
                      "networkIcon",
                      "identityIcon",
                      "text",
                    ]}
                    explore
                    network={bountyIndexer?.network}
                    address={address}
                  />
                </IdentityUserWrapper>

                <DescriptionWrapper>{description}</DescriptionWrapper>

                <ActionWrapper>
                  {isCurator && !unassignableApplicant ? (
                    <Button onClick={() => assignService({ applicant })}>
                      Assign
                    </Button>
                  ) : (
                    <TimeStatus {...applicant} />
                  )}
                </ActionWrapper>
              </Wrapper>
            </List.Item>
          );
        }}
      />
    </Card>
  );
}

function TimeStatus({ updatedAt, createdAt, status }) {
  return (
    <div>
      {status !== APPLICATION_STATUS.Apply ? (
        <>
          <StatusLabel>{status}</StatusLabel>
          <ActionTimeWrapper>
            <Time time={updatedAt} />
          </ActionTimeWrapper>
        </>
      ) : (
        <Time time={createdAt} />
      )}
    </div>
  );
}
