import serverApi from "services/serverApi";

const { createSlice } = require("@reduxjs/toolkit");

const childBountyDetailSlice = createSlice({
  name: "childBountyDetail",
  initialState: {
    detail: null,
  },
  reducers: {
    setChildBountyDetail(state, { payload }) {
      state.detail = payload;
    },
  },
});

export const { setChildBountyDetail } = childBountyDetailSlice.actions;

export const childBountyDetailSelector = (state) =>
  state.childBountyDetail.detail;

export const fetchChildBountyDetail =
  (network, bountyId, childBountyId) => async (dispatch) => {
    return serverApi
      .fetch(`/network/${network}/child-bounties/${bountyId}_${childBountyId}`)
      .then(({ result, error }) => {
        if (result) {
          return dispatch(setChildBountyDetail(result));
        }

        if (error) {
          return Promise.reject(error.message);
        }
      });
  };

export default childBountyDetailSlice.reducer;
