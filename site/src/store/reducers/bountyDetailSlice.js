import serverApi from "services/serverApi";

const { createSlice } = require("@reduxjs/toolkit");

const bountyDetailSlice = createSlice({
  name: "bountyDetailSlice",
  initialState: {
    detail: null,
  },
  reducers: {
    setBountyDetail(state, { payload }) {
      state.detail = payload;
    },
  },
});

export const { setBountyDetail } = bountyDetailSlice.actions;

export const bountyDetailSelector = (state) => state.bountyDetail.detail;

export const fetchBountyDetail = (network, bountyId) => async (dispatch) => {
  return serverApi
    .fetch(`network/${network}/bounties/${bountyId}`)
    .then(({ result, error }) => {
      if (result) {
        return dispatch(setBountyDetail(result));
      }

      if (error) {
        return Promise.reject(error.message);
      }
    });
};

export const resetBountyDetail = () => (dispatch) =>
  dispatch(setBountyDetail(null));

export default bountyDetailSlice.reducer;
