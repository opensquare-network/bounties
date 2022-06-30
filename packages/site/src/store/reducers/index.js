import { combineReducers } from "@reduxjs/toolkit";

import accountReducer from "./accountSlice";
import nodeReducer from "./nodeSlice";
import toastReducer from "./toastSlice";
import showConnectReducer from "./showConnectSlice";

export default combineReducers({
  account: accountReducer,
  node: nodeReducer,
  toast: toastReducer,
  showConnect: showConnectReducer,
});
