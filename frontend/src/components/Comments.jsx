import Moment from "react-moment";
import { Link } from "react-router-dom";
import Popup from "./PopUp";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteComment, editComment } from "../redux/api/comment";

const Comments = ({ comments, userId }) => {
	const [editCommentPopup, setEditCommentPopup] = useState(false);
	const [deleteCommentPopup, setDeleteCommentPopup] = useState(false);

	const [comment, setComment] = useState("");
	const [commentId, setCommentId] = useState("");

	const dispatch = useDispatch();

	const handleEditComment = (e) => {
		e.preventDefault();
		dispatch(editComment({ text: comment }, commentId));
		setEditCommentPopup(false);
	};

	const handleDeleteComment = () => {
		dispatch(deleteComment(commentId));
		setDeleteCommentPopup(false);
	};

	return (
		<div className='py-6'>
			<span className='text-dark-color font-semibold text-lg md:text-xl flex items-center gap-3'>
				({comments?.length || 0}) Comments{" "}
				<i className='bi bi-chat-left-dots-fill' />
			</span>
			<div className='px-4 my-6 border-border-color border rounded-lg bg-white'>
				{comments?.map((comment) => (
					<div key={comment?._id} className='comment py-5'>
						<div className='flex items-center justify-between'>
							<Link
								to={`/profile/${comment?.user}`}
								className='flex items-center gap-2 md:text-base text-sm text-dark-color font-semibold'
							>
								<img
									src={comment.userInfo?.profilePic?.url}
									alt={comment.userInfo?.firstName}
									className='rounded-full md:w-10 md:h-10 w-9 h-9'
								/>
								<h4>
									{comment.userInfo?.firstName} {comment.userInfo?.lastName}
								</h4>
							</Link>
							<p className='text-gray-500 md:text-base text-sm'>
								<Moment fromNow ago>
									{comment.createdAt}
								</Moment>{" "}
								ago
							</p>
						</div>
						<p className='ps-12 mt-2 text-gray-600 text-lg'>{comment?.text}</p>
						{(userId === comment?.user || userId === comment?.user?._id) && (
							<div className='flex items-center gap-3 justify-end me-5 text-sm mt-2'>
								<button
									onClick={() => {
										setEditCommentPopup(true);
										setComment(comment?.text);
										setCommentId(comment?._id);
									}}
									className='bg-darker-gradient py-1 px-3 rounded-md  text-white opacity-90 hover:opacity-100 active:scale-95 ease-in-out duration-200'
								>
									Edit <i className='bi bi-pencil-square' />
								</button>
								<button
									onClick={() => {
										setDeleteCommentPopup(true);
										setCommentId(comment?._id);
									}}
									className='bg-red-600 py-1 px-3 rounded-md  text-white opacity-90 hover:opacity-100 active:scale-95 ease-in-out duration-200'
								>
									Delete <i className='bi bi-trash-fill' />
								</button>
							</div>
						)}
					</div>
				))}
			</div>
			{/* Edit Comment Popup */}

			<Popup popup={editCommentPopup}>
				<form
					className='flex flex-col gap-6 justify-center items-center mb-5'
					onSubmit={handleEditComment}
				>
					<h3 className='text-3xl'>Edit Comment</h3>
					<input
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						className='p-2 rounded-md w-[300px] text-dark-color'
						autoFocus
					/>
					<div className='btns'>
						<button
							className='cancel'
							type='button'
							onClick={() => setEditCommentPopup(false)}
						>
							Cancel
						</button>
						<button type='submit'>Save</button>
					</div>
				</form>
			</Popup>

			{/* Delete post popup */}
			<Popup popup={deleteCommentPopup}>
				<i className='bi bi-exclamation-triangle' />
				<h1 className='text-center'>
					Are you sure you want to delete this comment
				</h1>
				<div className='btns'>
					<button
						className='cancel'
						onClick={() => setDeleteCommentPopup(false)}
					>
						Cancel
					</button>
					<button onClick={handleDeleteComment}>Delete</button>
				</div>
			</Popup>
		</div>
	);
};

export default Comments;
