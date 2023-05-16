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
import { useIsActionLoading } from "context/ActionLoadingContext";
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
            const { address, status } = applicant;
            const shouldShowAssignButton =
              canAssignHunter &&
              !workingApplicant &&
              childBountyDetail?.status !== CHILD_BOUNTY_STATUS.Closed &&
              status !== APPLICATION_STATUS.Canceled;

            const isBeneficiary =
              childBountyDetail?.status === CHILD_BOUNTY_STATUS.Awarded &&
              childBountyDetail?.beneficiary === address;

            return (
              <List.Item>
                <OnlyDesktop>
                  <DesktopListItem
                    isBeneficiary={isBeneficiary}
                    applicant={applicant}
                    assignService={assignService}
                    shouldShowAssignButton={shouldShowAssignButton}
                  />
                </OnlyDesktop>
                <OnlyMobile>
                  <MobileListItem
                    isBeneficiary={isBeneficiary}
                    applicant={applicant}
                    assignService={assignService}
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

function DesktopListItem({
  isBeneficiary,
  applicant,
  assignService,
  shouldShowAssignButton,
}) {
  const { address, bountyIndexer = {}, description } = applicant;
  const isLoading = useIsActionLoading();

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
        <TimeStatus
          className="time-status"
          {...applicant}
          status={isBeneficiary ? "awarded" : applicant.status}
        />
        <AssignButtonWrapper>
          <Button
            onClick={() => assignService({ applicant })}
            disabled={isLoading}
          >
            Assign
          </Button>
        </AssignButtonWrapper>
      </ActionWrapper>
    </Wrapper>
  );
}

function MobileListItem({
  isBeneficiary,
  applicant,
  assignService,
  shouldShowAssignButton,
}) {
  const {
    address,
    bountyIndexer = {},
    description,
    status,
    updatedAt,
  } = applicant;
  const isLoading = useIsActionLoading();

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
            <StatusLabel>{isBeneficiary ? "awarded" : status}</StatusLabel>
          </>
        )}
        <Dot />
        <Time time={updatedAt} />
      </IdentityUserWrapper>

      <MobileDescriptionGap />

      <DescriptionWrapper>{description}</DescriptionWrapper>

      <MobileDescriptionGap />

      {shouldShowAssignButton && (
        <Button
          block
          onClick={() => assignService({ applicant })}
          disabled={isLoading}
        >
          Assign
        </Button>
      )}
    </div>
  );
}
