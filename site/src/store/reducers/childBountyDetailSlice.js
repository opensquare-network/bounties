import serverApi from "services/serverApi";

const { createSlice } = require("@reduxjs/toolkit");

const childBountyDetailSlice = createSlice({
  name: "childBountyDetail",
  initialState: {
    detail: null,
    loaded: false,
  },
  reducers: {
    setChildBountyDetail(state, { payload }) {
      state.detail = payload;
    },
    setChildBountyDetailLoaded(state, { payload }) {
      state.loaded = payload;
    }
  },
});

export const { setChildBountyDetail, setChildBountyDetailLoaded } = childBountyDetailSlice.actions;

export const childBountyDetailSelector = (state) =>
  state.childBountyDetail.detail;

export const childBountyDetailLoadedSelector = (state) => state.childBountyDetail.loaded;

export const fetchChildBountyDetail =
  (network, bountyId, childBountyId) => async (dispatch) => {
    dispatch(setChildBountyDetailLoaded(false));
    return serverApi
      .fetch(`/network/${network}/child-bounties/${bountyId}_${childBountyId}`)
      .then(({ result, error }) => {
        if (result) {
          dispatch(setChildBountyDetail(result));
        }

        if (error) {
          dispatch(setChildBountyDetail(null));
        }

        dispatch(setChildBountyDetailLoaded(true));
      });
  };

export const resetChildBountyDetail = () => (dispatch) =>
  dispatch(setChildBountyDetail(null));

export default childBountyDetailSlice.reducer;
