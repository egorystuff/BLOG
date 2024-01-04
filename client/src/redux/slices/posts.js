import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPost = createAsyncThunk("posts/fetchPost", async () => {
  const { data } = await axios.get("/posts");
  return data;
});

const initialState = {
  posts: { items: [], status: "loading" },
  tags: { items: [], status: "loading" },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPost.pending]: (state, action) => {
      state.posts.status = "loading";
    },
    [fetchPost.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded";
    },
    [fetchPost.rejected]: (state, action) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
  },
});

export const postsReducer = postsSlice.reducer;

// export default postsSlice.reducer;
