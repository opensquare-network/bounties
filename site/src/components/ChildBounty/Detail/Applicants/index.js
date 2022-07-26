import {
  Card,
  LinkIdentityUser,
  List,
  Time,
  FlexCenter,
  Dot,
} from "@osn/common-ui";
import { ReactComponent as Loading } from "imgs/icons/loading.svg";
import {
  ApplicantWrapper,
  IdentityUserWrapper,
  TimeWrapper,
  Wrapper,
  Count,
} from "./styled";

export default function ChildBountyApplicants({ childBountyDetail }) {
  const { network, childBounty } = childBountyDetail ?? {};
  // FIXME: which value, now is `curators` instead
  const applicants = childBounty?.curators;

  return (
    <Card
      title={
        <>
          Applicants
          {!!applicants?.length && (
            <>
              <Dot />
              <Count>{applicants?.length}</Count>
            </>
          )}
        </>
      }
    >
      <List
        data={applicants}
        gap={20}
        noDataMessage="No current applicants"
        noDataProps={{ bordered: false, shadow: false }}
        loading={!childBountyDetail}
        loadingComponent={
          <FlexCenter>
            <Loading />
          </FlexCenter>
        }
        itemRender={(address) => (
          <List.Item>
            <Wrapper>
              <IdentityUserWrapper>
                <LinkIdentityUser
                  items={["avatarIcon", "networkIcon", "identityIcon", "text"]}
                  explore
                  network={network}
                  address={address}
                />
              </IdentityUserWrapper>

              <ApplicantWrapper>
                FIXME: Lobortis dictum odio semper consectetur dolor, elementum.
              </ApplicantWrapper>

              <TimeWrapper>
                <Time time={new Date()} />
              </TimeWrapper>
            </Wrapper>
          </List.Item>
        )}
      />
    </Card>
  );
}
