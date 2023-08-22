import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchPostsByCategory } from "../redux/api/posts";
import { useEffect } from "react";
import PostCard from "../components/PostCard";

const Category = () => {
	const { category } = useParams();
	const { postsCategories } = useSelector((state) => state.post);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchPostsByCategory(category));
		window.scrollTo(0, 0);
	}, [dispatch, category]);

	return (
		<section>
			<h1 className='heading'>{category} Posts</h1>
			{postsCategories.length ? (
				<div className='flex flex-col gap-16 mx-auto pb-36 max-w-3xl pt-10'>
					{postsCategories.map((post) => (
						<div key={post._id} className='max-w-3xl'>
							<PostCard post={post} page={"posts"} />
						</div>
					))}
				</div>
			) : (
				<div className='w-fit mx-auto text-center bg-light-gradient p-6 py-10 rounded-lg border-t border-border-color ease-in-out duration-200 shadow-md hover:-translate-y-1 hover:shadow-lg'>
					<h2 className='text-2xl py-5 text-gray-700'>
						No posts added for this category yet
					</h2>
					<div className='flex items-center justify-center gap-5'>
						<Link
							to='/posts'
							className='text-lg p-2 w-24 bg-darker-gradient opacity-90 hover:opacity-100 text-body-color rounded-md active:scale-95 ease-in-out duration-100 '
						>
							Posts
						</Link>
						<Link
							to='/'
							className='text-lg p-2 w-24 bg-darker-gradient opacity-90 hover:opacity-100 text-body-color rounded-md active:scale-95 ease-in-out duration-100 '
						>
							Home
						</Link>
					</div>
				</div>
			)}
		</section>
	);
};

export default Category;
