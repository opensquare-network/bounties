// copied from qa

import { createSlice } from "@reduxjs/toolkit";
import serverApi from "@/services/serverApi";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    unread: 0,
  },
  reducers: {
    setUnread(state, { payload }) {
      state.unread = payload;
    },
  },
});

export const { setUnread } = notificationSlice.actions;

export const unreadSelector = (state) => state.notification.unread;

export const fetchUnread = (network, address) => async (dispatch) => {
  serverApi
    .fetch(`/network/${network}/address/${address}/notifications/unread`)
    .then(({ result }) => {
      if (result) {
        dispatch(setUnread(result.count));
      }
    });
};

export const clearUnread = (network, address, body) => async (dispatch) => {
  return serverApi
    .post(
      `/network/${network}/address/${address}/notifications/clearunread`,
      body,
    )
    .then(({ result }) => {
      if (result) {
        dispatch(setUnread(0));
      }
    });
};

export default notificationSlice.reducer;
