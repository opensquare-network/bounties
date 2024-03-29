import { createSlice } from "@reduxjs/toolkit";
import serverApi from "@/services/serverApi";

const discussionSlice = createSlice({
  name: "discussion",
  initialState: {
    discussions: null,
  },
  reducers: {
    setDiscussions(state, { payload }) {
      state.discussions = payload;
    },
  },
});

export const { setDiscussions } = discussionSlice.actions;

export const discussionsSelector = (state) => state.discussion.discussions;

export const fetchBountyDiscussions =
  (network, bountyId, page) => async (dispatch) => {
    return serverApi
      .fetch(`/network/${network}/bounties/${bountyId}/comments`, {
        page,
        pageSize: 50,
      })
      .then((resp) => {
        if (resp?.result) {
          dispatch(setDiscussions(resp.result));
        }

        return resp;
      });
  };

export const fetchChildBountyDiscussions =
  (network, parentBountyId, index, page) => async (dispatch) => {
    return serverApi
      .fetch(
        `/network/${network}/child-bounties/${parentBountyId}_${index}/comments`,
        { page, pageSize: 50 },
      )
      .then((resp) => {
        if (resp?.result) {
          dispatch(setDiscussions(resp.result));
        }

        return resp;
      });
  };

export default discussionSlice.reducer;
