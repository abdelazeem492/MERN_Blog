import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
	name: "post",
	initialState: {
		posts: [],
		postsCount: 0,
		postsCategories: [],
		post: null,
	},
	reducers: {
		setPosts: (state, action) => {
			state.posts = action.payload;
		},
		setPostsCount: (state, action) => {
			state.postsCount = action.payload;
		},
		setPostsCategories: (state, action) => {
			state.postsCategories = action.payload;
		},
		setPost: (state, action) => {
			state.post = action.payload;
		},
		setLike: (state, action) => {
			state.post.likes = action.payload.likes;
		},
		deletePost: (state, action) => {
			state.posts = state.posts.filter((post) => post._id !== action.payload);
		},
		addComment: (state, action) => {
			state.post.comments.push(action.payload);
		},
		deleteComment: (state, action) => {
			const index = state.post.comments.findIndex(
				(comment) => comment._id === action.payload,
			);
			state.post.comments.splice(index, 1);
		},
		editComment: (state, action) => {
			state.post.comments = state.post.comments.map((comment) =>
				comment._id === action.payload._id ? action.payload : comment,
			);
		},
	},
});

const postReducer = postSlice.reducer;
const postActions = postSlice.actions;

export { postReducer, postActions };
