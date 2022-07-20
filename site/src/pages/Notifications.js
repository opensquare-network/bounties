// Copied from qa

import { useState } from "react";
import styled from "styled-components";

import { Pagination, Container, List, Flex } from "@osn/common-ui";
import { useDispatch, useSelector } from "react-redux";
import { clearUnread } from "store/reducers/notificationSlice";
import { accountSelector } from "store/reducers/accountSlice";
import NotificationItem from "../components/Notification/NotificationItem";
import NotificationTabs from "../components/Notification/NotificationTabs";
import { ReactComponent as CheckUnderline } from "@osn/common-ui/es/imgs/icons/check-underline.svg";
import { text_dark_minor } from "@osn/common-ui/es/styles/colors";
import { p_14_medium } from "@osn/common-ui/es/styles/textStyles";
import { useNotifications } from "utils/useNotifications";

const Wrapper = styled.div`
  position: relative;
  padding: 0 0 64px;
`;

const ContentWrapper = styled.div`
  position: relative;
  margin: 20px 0;
`;

const ReadAllButton = styled(Flex)`
  color: ${text_dark_minor};
  ${p_14_medium};
  cursor: pointer;
`;

export default function Notifications() {
  const dispatch = useDispatch();
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const account = useSelector(accountSelector);
  const [tab, setTab] = useState("notifications");
  const [isLoading, notifications, refresh] = useNotifications(
    page,
    account,
    tab,
    setPage,
  );

  return (
    <Wrapper>
      <NotificationTabs
        items={[{ value: "notifications", suffix: notifications?.total }]}
        value={tab}
        setValue={setTab}
        extra={
          notifications?.items?.length > 0 && (
            <ReadAllButton
              role="button"
              onClick={() => {
                dispatch(clearUnread(account.network, account.address));
                // do refresh
                refresh();
              }}
            >
              <CheckUnderline style={{ marginRight: 11 }} />
              Mark all as read
            </ReadAllButton>
          )
        }
      />

      <Container>
        <ContentWrapper>
          <List
            gap={20}
            loading={isLoading}
            data={notifications?.items}
            noDataMessage="No notifications"
            itemKey={(item) => `${item._id}_${item.read}`}
            itemRender={(item) => (
              <List.Item>
                <NotificationItem
                  data={item}
                  onMarkAsRead={(data) => {
                    dispatch(
                      clearUnread(account.network, account.address, {
                        items: [data._id],
                      }),
                    );
                  }}
                />
              </List.Item>
            )}
          />
        </ContentWrapper>

        <Pagination
          {...{ page, setPage, pageSize }}
          onChange={() => window.scrollTo(0, 0)}
          total={notifications?.total}
        />
      </Container>
    </Wrapper>
  );
}
