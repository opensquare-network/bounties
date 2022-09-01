import {
  LinkIdentityUser,
  List,
  Time,
  FlexCenter,
  Dot,
  LoadingIcon,
  Button,
  OnlyDesktop,
  OnlyMobile,
  Collapse,
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
  MobileDescriptionGap,
} from "./styled";

export default function ChildBountyApplicants({ childBountyDetail }) {
  const { applications = [] } = childBountyDetail ?? {};
  const { canAssignHunter } = useBountyPermission(childBountyDetail);

  const { assignService } = useWorkflowActionService(childBountyDetail);

  const workingApplicant = findWorkingApplicant(applications);

  return (
    <Collapse
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
            const { status } = applicant;
            const shouldShowAssignButton =
              canAssignHunter &&
              !workingApplicant &&
              childBountyDetail?.status !== CHILD_BOUNTY_STATUS.Closed &&
              status !== APPLICATION_STATUS.Canceled;

            return (
              <List.Item>
                <OnlyDesktop>
                  <DesktopListItem
                    applicant={applicant}
                    canAssignHunter={canAssignHunter}
                    assignService={assignService}
                    workingApplicant={workingApplicant}
                    childrenBountyDetail={childBountyDetail}
                    shouldShowAssignButton={shouldShowAssignButton}
                  />
                </OnlyDesktop>
                <OnlyMobile>
                  <MobileListItem
                    applicant={applicant}
                    canAssignHunter={canAssignHunter}
                    assignService={assignService}
                    workingApplicant={workingApplicant}
                    childrenBountyDetail={childBountyDetail}
                    shouldShowAssignButton={shouldShowAssignButton}
                  />
                </OnlyMobile>
              </List.Item>
            );
          }}
        />
      </ListWrapper>
    </Collapse>
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

function DesktopListItem({ applicant, assignService, shouldShowAssignButton }) {
  const { address, bountyIndexer = {}, description } = applicant;

  return (
    <Wrapper hoverShouldShowAssignButton={shouldShowAssignButton}>
      <IdentityUserWrapper>
        <LinkIdentityUser
          items={["avatarIcon", "networkIcon", "identityIcon", "text"]}
          explore
          network={bountyIndexer?.network}
          address={address}
        />
      </IdentityUserWrapper>

      <DescriptionWrapper>{description}</DescriptionWrapper>

      <ActionWrapper>
        <TimeStatus className="time-status" {...applicant} />
        <AssignButtonWrapper>
          <Button onClick={() => assignService({ applicant })}>Assign</Button>
        </AssignButtonWrapper>
      </ActionWrapper>
    </Wrapper>
  );
}

function MobileListItem({ applicant, assignService, shouldShowAssignButton }) {
  const {
    address,
    bountyIndexer = {},
    description,
    status,
    updatedAt,
  } = applicant;

  return (
    <div>
      <IdentityUserWrapper>
        <LinkIdentityUser
          items={["avatarIcon", "networkIcon", "identityIcon", "text"]}
          explore
          network={bountyIndexer?.network}
          address={address}
        />
        {status !== APPLICATION_STATUS.Apply && (
          <>
            <Dot />
            <StatusLabel>{status}</StatusLabel>
          </>
        )}
        <Dot />
        <Time time={updatedAt} />
      </IdentityUserWrapper>

      <MobileDescriptionGap />

      <DescriptionWrapper>{description}</DescriptionWrapper>

      <MobileDescriptionGap />

      {shouldShowAssignButton && (
        <Button block onClick={() => assignService({ applicant })}>
          Assign
        </Button>
      )}
    </div>
  );
}
