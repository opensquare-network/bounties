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
import { usePermission } from "hooks/usePermission";
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
  TimeStatusWrapper,
  AssignButtonWrapper,
} from "./styled";

export default function ChildBountyApplicants({ childBountyDetail }) {
  const { applications = [] } = childBountyDetail ?? {};
  const { canAssignHunter } = usePermission(childBountyDetail);

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
          const {
            address,
            bountyIndexer = {},
            description,
            status,
          } = applicant;

          const hoverShouldShowAssignButton =
            canAssignHunter &&
            !unassignableApplicant &&
            status !== APPLICATION_STATUS.Canceled;

          return (
            <List.Item>
              <Wrapper
                hoverShouldShowAssignButton={hoverShouldShowAssignButton}
              >
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
                  <TimeStatus className="time-status" {...applicant} />
                  <AssignButtonWrapper>
                    <Button onClick={() => assignService({ applicant })}>
                      Assign
                    </Button>
                  </AssignButtonWrapper>
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
    <TimeStatusWrapper>
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
    </TimeStatusWrapper>
  );
}
