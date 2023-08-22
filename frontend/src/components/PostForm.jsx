import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost, updatePost } from "../redux/api/posts";
import { fetchCategories } from "../redux/api/category";

const PostForm = ({ title, setCreatePostPopup, post, setEditPostPopup }) => {
	const [postTitle, setPostTitle] = useState(
		title === "Create New Post" ? "" : post?.title,
	);
	const [category, setCategory] = useState(
		title === "Create New Post" ? "" : post?.category,
	);
	const [description, setDescription] = useState(
		title === "Create New Post" ? "" : post?.description,
	);
	const [image, setImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { categories } = useSelector((state) => state.category);

	useEffect(() => {
		dispatch(fetchCategories());
	}, [dispatch]);

	const formData = new FormData();
	formData.append("title", postTitle);
	formData.append("category", category);
	formData.append("description", description);
	formData.append("image", image);

	const handleCreatePost = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		await dispatch(createPost(formData));
		setIsLoading(false);
		setCreatePostPopup(false);
		navigate("/posts");
	};

	const handleEditPost = async (e) => {
		e.preventDefault();
		await dispatch(
			updatePost({ title: postTitle, category, description }, post?._id),
		);
		setEditPostPopup(false);
	};
	return (
		<form
			method='post'
			onSubmit={title === "Create New Post" ? handleCreatePost : handleEditPost}
			className='flex flex-col gap-4 justify-center items-center sm:px-0 px-5 min-w-[370px] border-none'
		>
			<h1>{title}</h1>
			<div className='form-input gap-0'>
				<label htmlFor='title' style={{ color: "white" }}>
					Title
				</label>
				<input
					type='text'
					name='title'
					id='title'
					placeholder='Enter post title'
					className='text-dark-color'
					value={postTitle}
					onChange={(e) => setPostTitle(e.target.value)}
				/>
			</div>
			<div className='form-input gap-0'>
				<label htmlFor='category' style={{ color: "white" }}>
					Category
				</label>
				<select
					className='text-dark-color px-3 py-2 rounded-md bg-body-color'
					name='category'
					id='category'
					placeholder='Enter post category'
					value={category}
					onChange={(e) =>
						setCategory(e.target.options[e.target.selectedIndex].text)
					}
				>
					<option value='' disabled>
						Select your post category
					</option>
					{categories.map((category) => (
						<option key={category._id} value={category.title}>
							{category.title}
						</option>
					))}
				</select>
			</div>
			{title === "Create New Post" && (
				<div className='form-input gap-0'>
					<label htmlFor='description' style={{ color: "white" }}>
						Image
					</label>
					<input
						type='file'
						name='image'
						id='image'
						onChange={(e) => setImage(e.target.files[0])}
					/>
				</div>
			)}
			<div className='form-input gap-0'>
				<label htmlFor='description' style={{ color: "white" }}>
					Description
				</label>
				<textarea
					name='description'
					id='description'
					placeholder='Enter post description'
					rows={5}
					className='rounded-lg text-dark-color p-3'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</div>
			<div className='btns'>
				<button
					disabled={isLoading}
					type='button'
					className='cancel disabled:bg-border-color disabled:cursor-not-allowed'
					onClick={() => {
						title === "Create New Post"
							? setCreatePostPopup(false)
							: setEditPostPopup(false);
					}}
				>
					Cancel
				</button>
				<button
					className='disabled:cursor-not-allowed'
					disabled={isLoading}
					type='submit'
				>
					{isLoading ? "Creating..." : "save"}
				</button>
			</div>
		</form>
	);
};

export default PostForm;
