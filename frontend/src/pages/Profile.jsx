import { useEffect, useReducer, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
	deleteProfile,
	getProfile,
	uploadProfilePic,
} from "../redux/api/profile";
import PopUp from "../components/PopUp";
import EditProfile from "../components/EditProfile";
import PostForm from "../components/PostForm";
import useClickOutside from "../hooks/useClickOutside";
import PostCard from "../components/PostCard";
import { logout } from "../redux/api/auth";

const Profile = () => {
	const { id } = useParams();

	const { user } = useSelector((state) => state.auth);
	const { profile } = useSelector((state) => state.profile);

	const [dropdown, setDropdown] = useState(false);
	const [logoutPopup, setLogoutPopup] = useState(false);
	const [deletePopup, setDeletePopup] = useState(false);
	const [editPopup, setEditPopup] = useState(false);
	const [createPostPopup, setCreatePostPopup] = useState(false);
	const [file, setFile] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [posts, setPosts] = useState([]);

	const ref = useRef(null);
	useClickOutside(ref, () => setDropdown(false));

	const dispatch = useDispatch();

	const navigate = useNavigate();

	//* z: is a variable that will be used to force a re-render
	const [z, forceUpdate] = useReducer((x) => x + 1, 0);

	useEffect(() => {
		dispatch(getProfile(id));
		window.scrollTo(0, 0);
	}, [id, dispatch, z]);

	useEffect(() => {
		setPosts(profile?.posts);
	}, [profile?.posts]);

	const sortedPosts = posts
		? [...posts].sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		  )
		: [];

	const handleLogout = async () => {
		setIsLoading(true);
		await dispatch(logout());
		setIsLoading(false);
		setLogoutPopup(false);
	};

	const handleDeleteAccount = async () => {
		setIsLoading(true);
		await dispatch(deleteProfile(profile?._id));
		setIsLoading(false);
		navigate("/");
		window.location.reload();
	};

	const handleUploadProfilePic = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("profilePic", file);
		setIsLoading(true);
		await dispatch(uploadProfilePic(formData));
		setFile("");
		setIsLoading(false);
	};

	return (
		<section className='container'>
			<div className='relative bg-light-gradient flex flex-col justify-center items-center md:gap-4 gap-5 md:p-10 p-8 my-12 shadow-md border-t border-border-color rounded-lg'>
				<div className='relative'>
					<img
						src={file ? URL.createObjectURL(file) : profile?.profilePic?.url}
						alt={profile?.firstName + " " + profile?.lastName}
						className='w-24 h-24 rounded-full object-cover'
					/>
					{user?._id === id && (
						<form
							method='post'
							onSubmit={handleUploadProfilePic}
							className='absolute bottom-0 right-0 '
						>
							{!file && (
								<label
									htmlFor='upload-photo'
									title='choose photo'
									className='bi bi-camera-fill bg-container-color shadow cursor-pointer text-xl absolute w-7 h-7 flex justify-center items-center rounded-full bottom-0 right-0 hover:bg-white'
								/>
							)}
							<input
								type='file'
								id='upload-photo'
								name='profilePic'
								className='hidden'
								accept='image/*'
								onChange={(e) => setFile(e.target.files[0])}
							/>
							{file && (
								<button
									disabled={isLoading}
									className='bg-body-color shadow px-2 pb-1 rounded-md hover:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed'
								>
									{isLoading ? "Uploading..." : "Save"}
								</button>
							)}
						</form>
					)}
				</div>
				<h1 className='text-gradient text-center md:text-3xl text-2xl font-bold capitalize'>
					{profile?.firstName} {profile?.lastName}
				</h1>
				<h4 className='text-gray-500 md:text-lg text-center md:max-w-4xl text-sm'>
					{profile?.bio}
				</h4>
				<p className='text-dark-color md:text-base text-sm'>
					Date of join:{" "}
					<span className='text-blue-600 font-semibold '>
						{new Date(profile?.createdAt).toDateString()}
					</span>
				</p>
				{user?._id === id && (
					<div className='w-full text-end'>
						<button
							onClick={() => setCreatePostPopup(true)}
							className='bg-darker-gradient text-white md:text-base text-sm px-4 py-2 rounded-md ease-linear duration-100 opacity-80 hover:opacity-100 active:scale-95'
						>
							Create New Post
						</button>
					</div>
				)}
				{user?._id === id && (
					<div ref={ref} className='absolute right-5 top-6'>
						<i
							className='bi bi-three-dots-vertical text-3xl cursor-pointer text-dark-color'
							onClick={() => setDropdown(!dropdown)}
						/>
						{dropdown && (
							<div className='dropdown w-40 border-t absolute z-20 bg-gray-50 flex flex-col justify-center items-center top-9 right-5 rounded-lg shadow-lg overflow-hidden'>
								<button
									onClick={() => {
										setEditPopup(true);
										setDropdown(false);
									}}
									className='border-b border-border-color w-40 py-2 text-center pb-2 hover:bg-container-color'
								>
									Edit Profile
								</button>
								<Link
									to={"/forgot-password"}
									className='border-b border-border-color w-40 py-2 text-center pb-2 hover:bg-container-color'
								>
									Reset Password
								</Link>
								<button
									onClick={() => {
										setLogoutPopup(true);
										setDropdown(false);
									}}
									className='border-b border-border-color w-40 py-2 text-center pb-2 hover:bg-container-color '
								>
									Logout
								</button>
								<button
									onClick={() => {
										setDeletePopup(true);
										setDropdown(false);
									}}
									className='w-40 py-2 text-center text-red-600 pb-2 hover:bg-container-color'
								>
									Delete Account
								</button>
							</div>
						)}
					</div>
				)}
			</div>
			<section className='py-6 pb-16'>
				<h1 className='heading'>
					{user?._id === id ? "Your Posts" : `${profile?.firstName}'s Posts`}
				</h1>
				<div className='max-w-[800px] mx-auto '>
					{sortedPosts?.map((post) => (
						<div key={post?._id} className='mb-10'>
							<PostCard
								page={"posts"}
								post={post}
								username={profile?.firstName + " " + profile?.lastName}
								userPic={profile?.profilePic?.url}
								userId={profile?._id}
							/>
						</div>
					))}
				</div>
			</section>
			{/* Logout popup */}
			<PopUp popup={logoutPopup}>
				<i className='bi bi-exclamation-triangle' />
				<h1>Are you sure you want to logout</h1>
				<div className='btns'>
					<button className='cancel' onClick={() => setLogoutPopup(false)}>
						Cancel
					</button>
					<button disabled={isLoading} onClick={handleLogout}>
						{isLoading ? "loading..." : "Logout"}
					</button>
				</div>
			</PopUp>

			{/* Delete popup */}
			<PopUp popup={deletePopup}>
				<i className='bi bi-exclamation-triangle' />
				<h1>Are you sure you want to delete your account</h1>
				<div className='btns'>
					<button className='cancel' onClick={() => setDeletePopup(false)}>
						Cancel
					</button>
					<button onClick={handleDeleteAccount}>
						{isLoading ? "Deleting..." : "Delete"}
					</button>
				</div>
			</PopUp>

			{/* Edit Profile popup */}
			<PopUp popup={editPopup}>
				<EditProfile
					profile={profile}
					setEditPopup={setEditPopup}
					forceUpdate={forceUpdate}
				/>
			</PopUp>

			{/* Create Post popup */}
			<PopUp popup={createPostPopup}>
				<PostForm
					title={"Create New Post"}
					setCreatePostPopup={setCreatePostPopup}
					post={null}
				/>
			</PopUp>
		</section>
	);
};

export default Profile;
