import { postActions } from "../slices/postSlice";
import request from "../../utils/axiosRequest";
import { toast } from "react-hot-toast";
import { commentActions } from "../slices/commentSlice";

// Create Comment
export const createComment = (newComment) => async (dispatch, getState) => {
	try {
		const { data } = await request.post("/comments", newComment, {
			headers: {
				Authorization: `Bearer ${getState().auth.user.token}`,
			},
		});
		dispatch(postActions.addComment(data));
		toast.success("Comment added successfully");
	} catch (error) {
		toast.error(error.response.data.message);
	}
};

// Edit Comment
export const editComment =
	(comment, commentId) => async (dispatch, getState) => {
		try {
			const { data } = await request.put(`/comments/${commentId}`, comment, {
				headers: {
					Authorization: `Bearer ${getState().auth.user.token}`,
				},
			});
			dispatch(postActions.editComment(data));
			toast.success("Comment updated successfully");
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};

// Delete Comment
export const deleteComment = (commentId) => async (dispatch, getState) => {
	try {
		await request.delete(`/comments/${commentId}`, {
			headers: {
				Authorization: `Bearer ${getState().auth.user.token}`,
			},
		});
		dispatch(
			commentActions.setComments(
				getState().comment.comments.filter((c) => c._id !== commentId),
			),
		);
		dispatch(postActions.deleteComment(commentId));
		toast.success("Comment deleted successfully");
	} catch (error) {
		toast.error(error.response.data.message);
	}
};

// Get All Comments
export const getAllComments = () => async (dispatch, getState) => {
	try {
		const { data } = await request.get("/comments", {
			headers: {
				Authorization: `Bearer ${getState().auth.user.token}`,
			},
		});
		dispatch(commentActions.setComments(data));
	} catch (error) {
		toast.error(error.response.data.message);
	}
};
