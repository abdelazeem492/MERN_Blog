import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
	deletePost,
	fetchPostById,
	toggleLike,
	updatePostImage,
} from "../redux/api/posts";
import Popup from "../components/PopUp";
import PostForm from "../components/PostForm";
import toast from "react-hot-toast";
import Comments from "../components/Comments";
import { createComment } from "../redux/api/comment";

const Post = () => {
	const dispatch = useDispatch();
	const { post } = useSelector((state) => state.post);
	const { user } = useSelector((state) => state.auth);

	const { id } = useParams();
	const navigate = useNavigate();

	const [image, setImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [uploadButton, setUploadButton] = useState(false);
	const [editPostPopup, setEditPostPopup] = useState(false);
	const [deletePopup, setDeletePopup] = useState(false);
	const [comment, setComment] = useState("");

	useEffect(() => {
		dispatch(fetchPostById(id));
		window.scrollTo(0, 0);
	}, [dispatch, id]);

	const handleEdit = () => {
		setEditPostPopup(true);
	};

	const handleDelete = async () => {
		setIsLoading(true);
		await dispatch(deletePost(post._id));
		setIsLoading(false);
		setDeletePopup(false);
		navigate(`/profile/${user?._id}`);
	};

	const handleUpdateImage = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("image", image);
		image && setUploadButton(true);
		setIsLoading(true);
		await dispatch(updatePostImage(formData, post._id));
		setIsLoading(false);
		setUploadButton(false);
	};

	const handleLike = () => {
		if (user) dispatch(toggleLike(post?._id));
		else {
			toast.error("Please login first");
			navigate("/login");
		}
	};

	const handleAddComment = (e) => {
		e.preventDefault();
		if (!user) {
			toast.error("Please login first");
			navigate("/login");
		}
		if (comment.trim() === "") return toast.error("Comment cannot be empty");

		dispatch(createComment({ text: comment, postId: post._id }));
		setComment("");
	};

	return (
		<section className='container py-10'>
			<Link
				to={"/categories/" + post?.category}
				className='bg-blue-500 capitalize text-body-color md:text-xl text-lg my-5 w-fit px-5 py-1 rounded-md hover:shadow-md border hover:border-blue-500 ease-in-out duration-200'
			>
				{post?.category}
			</Link>
			<h1 className='md:text-4xl text-3xl font-semibold my-5'>{post?.title}</h1>
			<div className='flex items-center gap-14 mb-10'>
				<div className='flex items-center md:gap-3 gap-2'>
					<img
						className='md:w-12 md:h-12 h-10 w-10 rounded-full'
						src={post?.user?.profilePic?.url}
						alt={post?.user?.firstName}
					/>
					<p className='text-dark-color font-semibold md:text-lg '>
						{post?.user?.firstName} {post?.user?.lastName}
					</p>
				</div>
				<p className='text-light-color md:text-sm font-semibold text-xs'>
					{new Date(post?.createdAt).toDateString() +
						" " +
						new Date(post?.createdAt).toLocaleTimeString()}
				</p>
			</div>
			{post?.user?._id === user?._id && (
				<div className='flex items-center gap-4 md:justify-end justify-start flex-wrap'>
					<button
						onClick={handleEdit}
						className='bg-darker-gradient md:text-base text-sm py-1 px-3 rounded-md  text-white opacity-90 hover:opacity-100 active:scale-95 ease-in-out duration-200'
					>
						Edit <i className='bi bi-pencil-square' />
					</button>
					<button
						onClick={() => setDeletePopup(true)}
						className='bg-red-600 py-1 px-3 md:text-base text-sm rounded-md  text-white opacity-90 hover:opacity-100 active:scale-95 ease-in-out duration-200'
					>
						Delete <i className='bi bi-trash-fill' />
					</button>
					{/* Update image form */}
					<form onSubmit={handleUpdateImage}>
						<input
							type='file'
							className='hidden'
							onChange={(e) => {
								setImage(e.target.files[0]);
								setUploadButton(true);
							}}
							accept='image/*'
							id='image'
						/>
						{image && uploadButton ? (
							<button
								type='submit'
								className='bg-blue-500 py-1 md:text-base text-sm px-3 rounded-md  text-white opacity-90 hover:opacity-100 active:scale-95 ease-in-out duration-200'
							>
								{isLoading ? "Uploading..." : "Upload & Update"}{" "}
								{!isLoading && <i className='bi bi-upload' />}
							</button>
						) : (
							<label
								htmlFor='image'
								className='bg-blue-500 py-[6px] md:text-base text-sm px-3 rounded-md cursor-pointer  text-white opacity-90 hover:opacity-100 active:scale-95 ease-in-out duration-200'
							>
								Select new image <i className='bi bi-image' />
							</label>
						)}
					</form>
				</div>
			)}
			<img
				src={image ? URL.createObjectURL(image) : post?.image?.url}
				alt={post?.title}
				className='rounded-lg md:rounded-xl max-h-[700px] my-10'
			/>
			<p className='text-dark-color font-serif md:text-lg pb-10 border-b border-border-color'>
				{post?.description}
			</p>
			<div className='py-6 flex flex-wrap gap-6 items-center justify-between border-b border-border-color'>
				<div className='flex items-center gap-2'>
					<img
						src={
							post?.likes?.includes(user?._id)
								? "/images/like-blue.png"
								: "/images/like-black.png"
						}
						className='z-10 cursor-pointer hover:scale-105 ease-in-out duration-200 active:scale-95'
						alt=''
						width={40}
						onClick={handleLike}
					/>
					<span className='text-dark-color md:text-xl text-lg font-semibold'>
						<span className='text-blue-500 font-bold'>
							({post?.likes?.length})
						</span>{" "}
						Likes
					</span>
				</div>
				{/* Add Comment */}
				<form
					className='flex justify-center items-center gap-3'
					onSubmit={handleAddComment}
				>
					<input
						type='text'
						placeholder='Add comment'
						className='p-2 rounded-md border text-dark-color border-border-color w-[280px]'
						required
						onChange={(e) => setComment(e.target.value)}
						value={comment}
					/>
					<button
						disabled={comment.trim() === "" ? true : false}
						className='bg-blue-500 py-2 px-4 rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed text-white opacity-90 hover:opacity-100 active:scale-95 ease-in-out duration-200'
					>
						Add
					</button>
				</form>
			</div>

			<Comments comments={post?.comments} userId={user?._id} />

			{/* create post popup */}
			<Popup popup={editPostPopup}>
				<PostForm
					title={"Edit Post"}
					post={post}
					setEditPostPopup={setEditPostPopup}
				/>
			</Popup>
			{/* Delete post popup */}
			<Popup popup={deletePopup}>
				<i className='bi bi-exclamation-triangle' />
				<h1 className='text-center'>
					Are you sure you want to delete this post
				</h1>
				<div className='btns'>
					<button className='cancel' onClick={() => setDeletePopup(false)}>
						Cancel
					</button>
					<button disabled={isLoading} onClick={handleDelete}>
						{isLoading ? "Deleting..." : "Delete"}
					</button>
				</div>
			</Popup>
		</section>
	);
};

export default Post;
