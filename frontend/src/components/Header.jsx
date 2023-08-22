import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import Popup from "./PopUp";
import PostForm from "./PostForm";
import useClickOutside from "../hooks/useClickOutside";
import { logout } from "../redux/api/auth";

const navLinks = [
	{
		title: "Home",
		path: "/",
	},
	{
		title: "About",
		path: "/about",
	},
	{
		title: "Posts",
		path: "/posts",
	},
	{
		title: "Contact",
		path: "/contact",
	},
];

const Header = () => {
	const { user } = useSelector((state) => state.auth);
	const [dropdown, setDropdown] = useState(false);
	const [popup, setPopup] = useState(false);
	const [createPostPopup, setCreatePostPopup] = useState(false);
	const [openNav, setOpenNav] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const ref = useRef(null);
	useClickOutside(ref, () => {
		setDropdown(false);
	});

	const dispatch = useDispatch();

	const handleLogout = async () => {
		setIsLoading(true);
		await dispatch(logout());
		setIsLoading(false);
		setPopup(false);
	};

	useEffect(() => {
		window.onscroll = () => {
			setOpenNav(false);
		};
	});

	return (
		<header className='shadow text-dark-color flex items-center z-50'>
			<div className='flex container justify-between items-center  h-16 relative'>
				<Logo />
				<nav>
					<ul
						className={`nav-links ease-linear duration-200 md:right-0 ${
							openNav ? "right-0" : "-right-full"
						}`}
					>
						{navLinks.map((link, idx) => (
							<NavLink
								onClick={() => setOpenNav(false)}
								className='nav-link'
								to={link.path}
								key={idx}
							>
								{link.title}
							</NavLink>
						))}
						{user?.isAdmin && (
							<NavLink
								onClick={() => setOpenNav(false)}
								to='/dashboard'
								className='nav-link'
							>
								Dashboard
							</NavLink>
						)}
					</ul>
				</nav>
				{user ? (
					<div
						ref={ref}
						className='flex gap-3 items-center relative md:me-0 me-12 z-50'
					>
						<img
							src={user?.profilePic?.url}
							alt='user'
							className='profilePic cursor-pointer'
							onClick={() => setDropdown(!dropdown)}
						/>
						{dropdown && (
							<div
								onClick={() => setDropdown(false)}
								className='dropdown w-40 absolute z-20 bg-light-gradient flex gap-3 p-3 flex-col justify-center items-center top-12 right-0 rounded-lg shadow-lg'
							>
								<Link
									onClick={() => setDropdown(false)}
									to={`/profile/${user?._id}`}
									className=' w-full text-center p-1 outline outline-1 rounded-md ease-linear duration-200 hover:bg-container-color'
								>
									My Profile
								</Link>
								<Link
									onClick={() => {
										setDropdown(false);
										setCreatePostPopup(true);
									}}
									to={`/profile/${user?._id}`}
									className=' w-full text-center p-1 outline outline-1 rounded-md ease-linear duration-200 hover:bg-container-color'
								>
									Create Post
								</Link>
								<button
									onClick={() => {
										setDropdown(false);
										setPopup(true);
									}}
									className='rounded-md opacity-90 ease-linear duration-200 hover:opacity-100 bg-darker-gradient text-body-color w-full p-1 '
								>
									Logout <i className='bi bi-box-arrow-right' />
								</button>
							</div>
						)}
					</div>
				) : (
					<div className='flex gap-3 items-center md:me-0 me-12'>
						<Link
							to={"/login"}
							className=' md:w-24 w-fit md:text-base text-sm text-center btn px-4 py-1 border border-dark-color ease-linear duration-200 hover:bg-dark-color hover:text-body-color'
						>
							Login <i className='bi bi-box-arrow-in-right' />
						</Link>
						<Link
							to={"/register"}
							className='bg-darker-gradient opacity-80 w-26  md:tex-base text-sm md:block hidden  text-center text-body-color btn px-4 py-[7px] border-black ease-linear duration-200 hover:opacity-100'
						>
							Register <i className='bi bi-person-plus' />
						</Link>
					</div>
				)}
				{openNav ? (
					<i
						className={`bi bi-x-lg text-3xl cursor-pointer md:hidden block z-50 absolute right-5 ${
							openNav ? "text-body-color" : "text-dark-color"
						} `}
						onClick={() => setOpenNav(!openNav)}
					/>
				) : (
					<i
						className={`bi bi-list text-4xl cursor-pointer z-50 absolute md:hidden block right-5 ${
							openNav ? "text-body-color" : "text-dark-color"
						} `}
						onClick={() => setOpenNav(!openNav)}
					/>
				)}
			</div>
			{/* Logout popup */}
			<Popup popup={popup}>
				<i className='bi bi-exclamation-triangle' />
				<h1>Are you sure you want to logout</h1>
				<div className='btns'>
					<button className='cancel' onClick={() => setPopup(false)}>
						Cancel
					</button>
					<button disabled={isLoading} onClick={handleLogout}>
						{isLoading ? "loading..." : "Logout"}
					</button>
				</div>
			</Popup>

			{/* create post popup */}
			<Popup popup={createPostPopup}>
				<PostForm
					title={"Create New Post"}
					setCreatePostPopup={setCreatePostPopup}
				/>
			</Popup>
		</header>
	);
};

export default Header;
