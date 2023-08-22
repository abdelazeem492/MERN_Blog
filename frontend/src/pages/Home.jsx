import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import PostCard from "../components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllPosts } from "../redux/api/posts";
import { fetchCategories } from "../redux/api/category";

const Home = () => {
	const dispatch = useDispatch();
	const { posts } = useSelector((state) => state.post);
	const { categories } = useSelector((state) => state.category);

	const [allCategories, setAllCategories] = useState(7);

	useEffect(() => {
		dispatch(fetchAllPosts());
		dispatch(fetchCategories());
		window.scrollTo(0, 0);
	}, [dispatch]);
	return (
		<main className='container mb-10'>
			<Hero />
			<section className='categories my-8 mb-12' id='categories'>
				<h1 className='heading'>Categories</h1>
				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 '>
					{categories.slice(0, allCategories).map((category) => (
						<CategoryCard category={category} key={category._id} />
					))}
					{allCategories > 7 && (
						<button
							onClick={() => setAllCategories(categories.length)}
							className='rounded-lg flex justify-center bg-light-gradient flex-row-reverse gap-2 items-center text-lg  font-semibold h-28 hover:shadow-lg ease-in-out duration-300 hover:-translate-y-1'
						>
							<i className='bi bi-arrow-right text-xl rounded-full bg-darker-gradient text-body-color w-8 h-8 flex items-center justify-center' />
							View all
						</button>
					)}
				</div>
			</section>
			<section className='posts my-20'>
				<h1 className='heading'>Latest Posts</h1>
				<div className='grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{posts.slice(0, 9).map((post) => (
						<PostCard post={post} key={post._id} page={"home"} />
					))}
				</div>
				<div className='flex justify-center mt-16'>
					<Link
						to={"/posts"}
						className='text-dark-color flex items-center justify-center gap-2 p-2 border border-light-color w-fit rounded-md ease-linear duration-200 hover:bg-container-color '
					>
						View all posts{" "}
						<i className='bi bi-arrow-right text-sm rounded-full bg-darker-gradient text-body-color w-6 h-6 flex items-center justify-center' />
					</Link>
				</div>
			</section>
		</main>
	);
};

export default Home;
