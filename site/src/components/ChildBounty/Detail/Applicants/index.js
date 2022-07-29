import {
  Card,
  LinkIdentityUser,
  List,
  Time,
  FlexCenter,
  Dot,
  LoadingIcon,
} from "@osn/common-ui";
import {
  ApplicantWrapper,
  IdentityUserWrapper,
  TimeWrapper,
  Wrapper,
  Count,
} from "./styled";

export default function ChildBountyApplicants({ childBountyDetail }) {
  const { applications = [] } = childBountyDetail ?? {};

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
          const {
            address,
            createdAt,
            bountyIndexer = {},
            description,
          } = application;

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

                <ApplicantWrapper>{description}</ApplicantWrapper>

                <TimeWrapper>
                  <Time time={new Date(createdAt)} />
                </TimeWrapper>
              </Wrapper>
            </List.Item>
          );
        }}
      />
    </Card>
  );
}
