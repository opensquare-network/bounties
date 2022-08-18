import {
  Card,
  LinkIdentityUser,
  List,
  Time,
  FlexCenter,
  Dot,
  LoadingIcon,
  Button,
  Divider,
} from "@osn/common-ui";
import StatusLabel from "components/Bounty/StatusLabel";
import { useBountyPermission } from "hooks/useBountyPermission";
import { useWorkflowActionService } from "hooks/useWorkflowActionService";
import { APPLICATION_STATUS, CHILD_BOUNTY_STATUS } from "utils/constants";
import { findWorkingApplicant } from "../Meta/actions/utils";
import {
  DescriptionWrapper,
  IdentityUserWrapper,
  ActionWrapper,
  Wrapper,
  Count,
  ActionTimeWrapper,
  TimeStatusWrapper,
  AssignButtonWrapper,
  ListWrapper,
} from "./styled";

export default function ChildBountyApplicants({ childBountyDetail }) {
  const { applications = [] } = childBountyDetail ?? {};
  const { canAssignHunter } = useBountyPermission(childBountyDetail);

  const { assignService } = useWorkflowActionService(childBountyDetail);

  const workingApplicant = findWorkingApplicant(applications);

  return (
    <div>
      <Card.Head
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
      />

      <Divider />

      <ListWrapper>
        <List
          data={applications}
          gap={32}
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
              !workingApplicant &&
              childBountyDetail?.status !== CHILD_BOUNTY_STATUS.Closed &&
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
      </ListWrapper>
    </div>
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
