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
import { findAssignedApplicant } from "../Meta/actions/utils";
import {
  DescriptionWrapper,
  IdentityUserWrapper,
  ActionWrapper,
  Wrapper,
  Count,
} from "./styled";

export default function ChildBountyApplicants({ childBountyDetail }) {
  const { applications = [], childBounty } = childBountyDetail ?? {};
  const { curators = [] } = childBounty ?? {};
  const account = useAccount();

  const isCurator = curators.includes(account?.encodedAddress);
  const { assignService } = useWorkflowActionService(childBountyDetail);

  const assignedApplicant = findAssignedApplicant(applications);

  function handleAssign(applicantAddress) {
    assignService({ applicantAddress });
  }

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
        gap={20}
        noDataMessage="No current applicants"
        noDataProps={{ bordered: false, shadow: false }}
        loading={!childBountyDetail}
        loadingComponent={
          <FlexCenter>
            <LoadingIcon />
          </FlexCenter>
        }
        itemRender={(application) => {
          const { address, bountyIndexer = {}, description } = application;

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
                  {isCurator ? (
                    <CuratorAction
                      hasAssignedApplicant={!!assignedApplicant}
                      handleAssign={handleAssign}
                      {...application}
                    />
                  ) : (
                    <HunterAction {...application} />
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

function CuratorAction({
  handleAssign,
  hasAssignedApplicant,
  address,
  status,
  updatedAt,
}) {
  return !hasAssignedApplicant ? (
    <Button onClick={() => handleAssign(address)}>Assign</Button>
  ) : (
    <div>
      {status !== APPLICATION_STATUS.Apply && (
        <StatusLabel>{status}</StatusLabel>
      )}
      <Time time={updatedAt} />
    </div>
  );
}

function HunterAction({ createdAt, status }) {
  return (
    <div>
      {status !== APPLICATION_STATUS.Apply && (
        <StatusLabel>{status}</StatusLabel>
      )}
      <Time time={createdAt} />
    </div>
  );
}
