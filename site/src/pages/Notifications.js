// Copied from qa

import { useState } from "react";
import styled, { css } from "styled-components";

import {
  Pagination,
  Container,
  List,
  Flex,
  LoadingIcon,
  text_dark_accessory,
} from "@osn/common-ui";
import { useDispatch, useSelector } from "react-redux";
import { clearUnread, unreadSelector } from "store/reducers/notificationSlice";
import { accountSelector } from "store/reducers/accountSlice";
import NotificationItem from "../components/Notification/NotificationItem";
import NotificationTabs from "../components/Notification/NotificationTabs";
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

  ${(p) =>
    p.disabled &&
    css`
      color: ${text_dark_accessory};
      cursor: default;
    `}
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
  const unread = useSelector(unreadSelector);

  const [clearingAll, setClearingAll] = useState(false);

  function handleMarkAllAsRead() {
    setClearingAll(true);

    dispatch(clearUnread(account.network, account.address))
      .then(() => {
        // do refresh
        refresh();
      })
      .finally(() => {
        setClearingAll(false);
      });
  }

  return (
    <Wrapper>
      <NotificationTabs
        items={[{ value: "notifications", suffix: notifications?.total }]}
        value={tab}
        setValue={setTab}
        extra={
          notifications?.items?.length > 0 &&
          !!unread && (
            <ReadAllButton
              role="button"
              onClick={handleMarkAllAsRead}
              disabled={clearingAll}
            >
              {clearingAll ? (
                <LoadingIcon />
              ) : (
                <img src="imgs/icons/readed.svg" alt="readed" />
              )}
              <span style={{ marginLeft: 8 }}>Mark all as read</span>
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
                <NotificationItem data={item} />
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
