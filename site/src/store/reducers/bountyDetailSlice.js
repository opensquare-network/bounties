import { createSlice } from "@reduxjs/toolkit";
import serverApi from "services/serverApi";

const bountyDetailSlice = createSlice({
  name: "bountyDetailSlice",
  initialState: {
    detail: null,
    loaded: false,
  },
  reducers: {
    setBountyDetail(state, { payload }) {
      state.detail = payload;
    },
    setBountyDetailLoaded(state, { payload }) {
      state.loaded = payload;
    }
  },
});

export const { setBountyDetail, setBountyDetailLoaded } = bountyDetailSlice.actions;

export const bountyDetailSelector = (state) => state.bountyDetail.detail;
export const bountyDetailLoadedSelector = (state) => state.bountyDetail.loaded;

export const fetchBountyDetail = (network, bountyId) => async (dispatch) => {
  dispatch(setBountyDetailLoaded(false));
  return serverApi
    .fetch(`network/${network}/bounties/${bountyId}`)
    .then(({ result, error }) => {
      if (result) {
        dispatch(setBountyDetail(result));
      }

      if (error) {
        dispatch(setBountyDetail(null));
      }

      dispatch(setBountyDetailLoaded(true));
    });
};

export const resetBountyDetail = () => (dispatch) => {
  dispatch(setBountyDetail(null));
  dispatch(setBountyDetailLoaded(false));
};

export default bountyDetailSlice.reducer;
