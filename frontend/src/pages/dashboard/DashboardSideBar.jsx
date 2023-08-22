import { useState } from "react";
import { Link } from "react-router-dom";

const sidebarLinks = [
	{
		name: "Dashboard",
		path: "/dashboard",
		icon: "bi bi-house-door",
	},
	{
		name: "Users",
		path: "/dashboard/users",
		icon: "bi bi-people",
	},
	{
		name: "Posts",
		path: "/dashboard/posts",
		icon: "bi bi-file-post",
	},
	{
		name: "Categories",
		path: "/dashboard/categories",
		icon: "bi bi-tags",
	},
	{
		name: "Comments",
		path: "/dashboard/comments",
		icon: "bi bi-chat-left-dots",
	},
];

const DashboardSideBar = () => {
	const activeLink = window.location.pathname;
	const [openSidebar, setOpenSidebar] = useState(false);

	return (
		<div
			className={`bg-body-color border-e ${
				openSidebar ? "w-80" : "w-16"
			}  py-3 duration-200 ease-in-out`}
			style={{
				minHeight: "calc(100vh - 125px)",
				boxShadow: "0px 4px 4px 1px rgba(0, 0, 0, 0.1)",
			}}
		>
			<button
				className='w-full text-right pe-5'
				onClick={() => setOpenSidebar(!openSidebar)}
			>
				<i
					className={`bi bi-${
						openSidebar ? "chevron-left" : "chevron-right"
					} text-2xl`}
				/>
			</button>
			<h1
				className={` font-semibold text-center uppercase px-5 duration-200 ease-linear`}
				style={{
					fontSize: openSidebar ? 30 : 0,
				}}
			>
				Dashboard
			</h1>
			<p className='w-full h-[1px] mt-5  bg-border-color' />
			<nav>
				{sidebarLinks.map((link) => (
					<Link
						to={link.path}
						key={link.name}
						className={`block py-3 text-lg last-of-type:border-none border-b px-5 w-full hover:bg-container-color duration-75 ease-linear active:bg-border-color ${
							link.path === activeLink && "bg-container-color"
						}`}
					>
						<div className='flex items-center'>
							<i className={link.icon + "  text-2xl w-10"} />
							<span
								className='duration-200 ease-linear'
								style={{
									fontSize: openSidebar ? 18 : 0,
								}}
							>
								{link.name}
							</span>
						</div>
					</Link>
				))}
			</nav>
		</div>
	);
};

export default DashboardSideBar;
