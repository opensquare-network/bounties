import { combineReducers } from "@reduxjs/toolkit";

import accountReducer from "./accountSlice";
import nodeReducer from "./nodeSlice";
import toastReducer from "./toastSlice";
import showConnectReducer from "./showConnectSlice";
import bountyReducer from "./bountySlice";
import discussionReducer from "./discussionSlice";

export default combineReducers({
  account: accountReducer,
  node: nodeReducer,
  toast: toastReducer,
  showConnect: showConnectReducer,
  bounty: bountyReducer,
  discussion: discussionReducer,
});
