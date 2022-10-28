import serverApi from "services/serverApi";
import {
  CHILD_BOUNTY_CURATOR_VIEWS,
  CHILD_BOUNTY_CURATOR_VIEW_KEY,
} from "utils/constants";

const { createSlice } = require("@reduxjs/toolkit");

const childBountyDetailSlice = createSlice({
  name: "childBountyDetail",
  initialState: {
    detail: null,
    loaded: false,
    curatorView:
      localStorage.getItem(CHILD_BOUNTY_CURATOR_VIEW_KEY) ??
      CHILD_BOUNTY_CURATOR_VIEWS.CuratorView,
  },
  reducers: {
    setChildBountyDetail(state, { payload }) {
      state.detail = payload;
    },
    setChildBountyDetailLoaded(state, { payload }) {
      state.loaded = payload;
    },
    setChildBountyDetailCuratorView(state, { payload }) {
      localStorage.setItem(CHILD_BOUNTY_CURATOR_VIEW_KEY, payload);
      state.curatorView = payload;
    },
  },
});

export const {
  setChildBountyDetail,
  setChildBountyDetailLoaded,
  setChildBountyDetailCuratorView,
} = childBountyDetailSlice.actions;

export const childBountyDetailSelector = (state) =>
  state.childBountyDetail.detail;

export const childBountyDetailLoadedSelector = (state) =>
  state.childBountyDetail.loaded;

export const childBountyDetailCuratorViewSelector = (state) =>
  state.childBountyDetail.curatorView;

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
