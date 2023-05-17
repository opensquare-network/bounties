import { createSlice } from "@reduxjs/toolkit";
import serverApi from "@/services/serverApi";

const bountySlice = createSlice({
  name: "bounty",
  initialState: {
    bountyList: [],
    childBountyList: [],
  },
  reducers: {
    setBountyList(state, { payload }) {
      state.bountyList = payload;
    },
    setChildBountyList(state, { payload }) {
      state.childBountyList = payload;
    },
  },
});

export const { setBountyList, setChildBountyList } = bountySlice.actions;

export const bountyListSelector = (state) => state.bounty.bountyList;
export const childBountyListSelector = (state) => state.bounty.childBountyList;

export const fetchBountyList = () => async (dispatch) => {
  return serverApi.fetch("/bounties", {}).then(({ result, error }) => {
    if (result) {
      return dispatch(setBountyList(result));
    }

    if (error) {
      return Promise.reject(error.message);
    }
  });
};

export const fetchChildBountyList = () => async (dispatch) => {
  return serverApi.fetch("/child-bounties", {}).then(({ result, error }) => {
    if (result) {
      return dispatch(setChildBountyList(result));
    }
    if (error) {
      return Promise.reject(error.message);
    }
  });
};

export default bountySlice.reducer;
