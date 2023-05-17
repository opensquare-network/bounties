// copied from qa

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import serverApi from "../services/serverApi";
import { EmptyList } from "./constants";
import { unreadSelector } from "@/store/reducers/notificationSlice";

export function useNotifications(page, account, tab, setPage) {
  const pageSize = 10;
  const [notifications, setNotifications] = useState(EmptyList);
  const [isLoading, setIsLoading] = useState(true);
  const unread = useSelector(unreadSelector);
  const [prevUnread, setPrevUnread] = useState(unread);

  const refresh = useCallback(() => {
    if (account?.network && account?.address) {
      serverApi
        .fetch(
          `/network/${account.network}/address/${account.address}/notifications`,
          { page, pageSize },
        )
        .then(({ result }) => {
          if (result) {
            setNotifications(result);
          }
        });
    }
  }, [account?.network, account?.address, page, pageSize]);

  useEffect(() => {
    // Got new notifications
    if (unread > prevUnread) {
      refresh();
    }

    setPrevUnread(unread);
  }, [unread, prevUnread, refresh]);

  useEffect(() => {
    setNotifications(null);
    setPage(1);
  }, [setPage, tab]);

  useEffect(() => {
    if (account?.network && account?.address) {
      setIsLoading(true);
      serverApi
        .fetch(
          `/network/${account.network}/address/${account.address}/notifications`,
          { page, pageSize },
        )
        .then(({ result }) => {
          if (result) {
            setNotifications(result);
          } else {
            setNotifications(EmptyList);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [account?.network, account?.address, page, tab]);

  return [isLoading, notifications, refresh];
}
