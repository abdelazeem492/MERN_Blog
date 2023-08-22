import { Link } from "react-router-dom";

const PostCard = ({ post, page, username, userPic, userId }) => {
	return (
		<Link
			to={`/posts/${post?.id}`}
			className={`p-3 mx-auto w-full flex border border-border-color rounded-lg hover:shadow-lg ease-in-out duration-300 hover:-translate-y-1`}
		>
			<div className='post w-full'>
				<img
					loading='lazy'
					src={post?.image?.url}
					alt={post?.title}
					className={`rounded-lg w-full mx-auto ${
						page === "home"
							? "h-[350px] md:h-[250px]"
							: "md:h-[500px] h-[350px]"
					} mb-5 object-cover`}
				/>
				<div className='post-info flex flex-col md:gap-3 gap-1 '>
					<Link
						to={`/categories/${post?.category}`.toLowerCase()}
						className='bg-light-gradient capitalize text-blue-600 font-semibold mt-3 w-fit px-4 py-1 rounded-md hover:shadow-md border hover:border-blue-500 ease-in-out duration-200'
					>
						{post?.category}
					</Link>
					<h3 className='md:text-2xl text-xl font-semibold py-2'>
						{post?.title}
					</h3>

					<Link
						to={`/profile/${post?.user?._id || userId}`}
						className='post-user flex items-center gap-2 text-dark-color font-semibold pt-3 border-t border-border-color w-full'
					>
						<img
							src={post?.user?.profilePic?.url || userPic}
							alt='user'
							className='md:w-10 md:h-10 h-9 w-9 rounded-full'
						/>
						<p className='md:text-base text-sm'>
							{post?.user?.firstName && post?.user?.lastName
								? post?.user?.firstName + " " + post?.user?.lastName
								: username}
							<p className='text-gray-500 md:text-sm text-xs'>
								{new Date(post?.createdAt).toLocaleString()}
							</p>
						</p>
					</Link>
				</div>
			</div>
		</Link>
	);
};

export default PostCard;
