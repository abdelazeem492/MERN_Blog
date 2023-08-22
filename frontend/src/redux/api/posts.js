import { postActions } from "../slices/postSlice";
import request from "../../utils/axiosRequest";
import { toast } from "react-hot-toast";

//* Fetch all posts
export const fetchAllPosts = () => async (dispatch) => {
	try {
		const { data } = await request.get("/posts");
		dispatch(postActions.setPosts(data));
	} catch (error) {
		toast.error(error.response.data.message);
	}
};

//* Get posts count
export const getPostsCount = () => async (dispatch) => {
	try {
		const { data } = await request.get("/posts/count");
		dispatch(postActions.setPostsCount(data));
	} catch (error) {
		toast.error(error.response.data.message);
	}
};

//* Fetch posts by category
export const fetchPostsByCategory = (category) => async (dispatch) => {
	try {
		const { data } = await request.get(`/posts?category=${category}`);
		dispatch(postActions.setPostsCategories(data));
	} catch (error) {
		toast.error(error.response.data.message);
	}
};

//* Create post
export const createPost = (newPost) => async (dispatch, getState) => {
	try {
		const { data } = await request.post("/posts", newPost, {
			headers: {
				Authorization: `Bearer ${getState().auth.user.token}`,
				"Content-Type": "multipart/form-data",
			},
		});
		dispatch(postActions.setPosts([data, ...getState().post.posts]));
		toast.success("Post Created Successfully");
	} catch (error) {
		toast.error(error.response.data.message);
	}
};

//* Fetch post by id
export const fetchPostById = (postId) => async (dispatch) => {
	try {
		const { data } = await request.get(`/posts/${postId}`);
		dispatch(postActions.setPost(data));
	} catch (error) {
		toast.error(error.response.data.message);
	}
};

//* Toggle like for post
export const toggleLike = (postId) => async (dispatch, getState) => {
	try {
		const { data } = await request.put(
			`/posts/like/${postId}`,
			{},
			{
				headers: {
					Authorization: `Bearer ${getState().auth.user.token}`,
				},
			},
		);
		dispatch(postActions.setLike(data));
	} catch (error) {
		toast.error(error.response.data.message);
	}
};

//* Update post image
export const updatePostImage =
	(newImg, postId) => async (dispatch, getState) => {
		try {
			await request.put(`/posts/upload-image/${postId}`, newImg, {
				headers: {
					Authorization: `Bearer ${getState().auth.user.token}`,
					"Content-Type": "multipart/form-data",
				},
			});
			toast.success("Post Image Updated Successfully");
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};

//* Update post
export const updatePost = (newPost, postId) => async (dispatch, getState) => {
	try {
		const { data } = await request.put(`/posts/${postId}`, newPost, {
			headers: {
				Authorization: `Bearer ${getState().auth.user.token}`,
			},
		});
		dispatch(postActions.setPost(data));
		toast.success("Post Updated Successfully");
	} catch (error) {
		toast.error(error.response.data.message);
	}
};

//* Delete post
export const deletePost = (postId) => async (dispatch, getState) => {
	try {
		const { data } = await request.delete(`/posts/${postId}`, {
			headers: {
				Authorization: `Bearer ${getState().auth.user.token}`,
			},
		});
		dispatch(postActions.deletePost(data.postId));
		toast.success(data.message);
	} catch (error) {
		toast.error(error.response.data.message);
	}
};
