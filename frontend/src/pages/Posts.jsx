import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../redux/api/posts";
import PostCard from "../components/PostCard";
import Loader from "../components/loader/Loader";

const Posts = () => {
	const dispatch = useDispatch();
	const { posts } = useSelector((state) => state.post);

	useEffect(() => {
		dispatch(fetchAllPosts());
		window.scrollTo(0, 0);
	}, [dispatch]);

	return (
		<section className='container'>
			<h1 className='heading'>Explore All Posts</h1>
			{posts.length ? (
				<div className='flex flex-col gap-16 w-fit mx-auto pb-36 pt-10'>
					{posts.map((post) => (
						<div key={post._id} className='max-w-3xl '>
							<PostCard post={post} page={"posts"} />
						</div>
					))}
				</div>
			) : (
				<Loader />
			)}
		</section>
	);
};

export default Posts;
