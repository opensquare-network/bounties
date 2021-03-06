import { combineReducers } from "@reduxjs/toolkit";

import accountReducer from "./accountSlice";
import nodeReducer from "./nodeSlice";
import toastReducer from "./toastSlice";
import bountyReducer from "./bountySlice";
import discussionReducer from "./discussionSlice";
import notificationReducer from "./notificationSlice";

export default combineReducers({
  account: accountReducer,
  node: nodeReducer,
  toast: toastReducer,
  bounty: bountyReducer,
  discussion: discussionReducer,
  notification: notificationReducer,
});
