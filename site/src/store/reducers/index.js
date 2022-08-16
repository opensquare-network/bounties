import { combineReducers } from "@reduxjs/toolkit";

import accountReducer from "./accountSlice";
import nodeReducer from "./nodeSlice";
import bountyReducer from "./bountySlice";
import discussionReducer from "./discussionSlice";
import notificationReducer from "./notificationSlice";
import childBountyDetailSlice from "./childBountyDetailSlice";
import bountyDetailSlice from "./bountyDetailSlice";

export default combineReducers({
  account: accountReducer,
  node: nodeReducer,
  bounty: bountyReducer,
  discussion: discussionReducer,
  notification: notificationReducer,
  childBountyDetail: childBountyDetailSlice,
  bountyDetail: bountyDetailSlice,
});
