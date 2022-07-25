import { Card, LinkIdentityUser, List, Time } from "@osn/common-ui";
import DetailLoader from "@osn/common-ui/es/Skeleton/DetailLoader";
import {
  ApplicantWrapper,
  IdentityUserWrapper,
  TimeWrapper,
  Wrapper,
} from "./styled";

export default function ChildBountyApplicants({ bountyDetail }) {
  return (
    <Card title="Applicants">
      <List
        data={["", ""]}
        gap={20}
        noDataMessage="No current applicants"
        noDataProps={{ bordered: false, shadow: false }}
        loadingComponent={<DetailLoader />}
        itemRender={(item) => (
          <List.Item>
            <Wrapper>
              <IdentityUserWrapper>
                <LinkIdentityUser
                  items={["avatarIcon", "networkIcon", "identityIcon", "text"]}
                  explore
                  network="kusama"
                  address="ESgz7GLVW7BL5DhRgpVnxSXVwaKt4ytWcrf52TY1GQD1cEb"
                />
              </IdentityUserWrapper>

              <ApplicantWrapper>
                Lobortis dictum odio semper consectetur dolor, elementum.
              </ApplicantWrapper>

              <TimeWrapper>
                <Time time={Date.now()} />
              </TimeWrapper>
            </Wrapper>
          </List.Item>
        )}
      />
    </Card>
  );
}
