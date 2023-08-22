import { useEffect, useState } from "react";
import DashboardSideBar from "./DashboardSideBar";
import { useDispatch, useSelector } from "react-redux";
import CountCard from "./CountCard";
import { getUsersCount } from "../../redux/api/profile";
import { getPostsCount } from "../../redux/api/posts";
import { createCategory, fetchCategories } from "../../redux/api/category";
import { getAllComments } from "../../redux/api/comment";

const Dashboard = () => {
	const { usersCount } = useSelector((state) => state.profile);
	const { postsCount } = useSelector((state) => state.post);
	const { categories } = useSelector((state) => state.category);
	const { comments } = useSelector((state) => state.comment);

	const [category, setCategory] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();
	useEffect(() => {
		window.scrollTo(0, 0);
		dispatch(getUsersCount());
		dispatch(getPostsCount());
		dispatch(fetchCategories());
		dispatch(getAllComments());
	}, [dispatch]);

	const handleCreateCategory = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		await dispatch(createCategory({ title: category.toLowerCase() }));
		setIsLoading(false);
		setCategory("");
	};
	return (
		<section className='flex'>
			<DashboardSideBar />
			<main className='p-5 pt-10 pe-10 flex-1'>
				<div className='flex items-center gap-4 justify-between pb-10 border-b-2 flex-wrap'>
					<CountCard
						count={usersCount?.usersCount}
						icon={"bi bi-people"}
						title='Users'
						path='/dashboard/users'
					/>
					<CountCard
						count={postsCount?.postsCount}
						icon={"bi bi-file-post"}
						title='Posts'
						path='/dashboard/posts'
					/>
					<CountCard
						count={categories?.length}
						icon={"bi bi-tags"}
						title='Categories'
						path='/dashboard/categories'
					/>
					<CountCard
						count={comments?.length}
						icon={"bi bi-chat-left-dots"}
						title='Comments'
						path='/dashboard/comments'
					/>
				</div>
				<div className='py-6'>
					{/* Create category form */}
					<form className='form' onSubmit={handleCreateCategory}>
						<h1 className='md:text-2xl text-xl font-semibold'>
							Create New Category
						</h1>
						<div className='form-input'>
							<label htmlFor='name'>Category</label>
							<input
								placeholder='Enter Category'
								type='text'
								name='name'
								id='name'
								onChange={(e) => setCategory(e.target.value)}
								value={category}
							/>
						</div>
						<button
							disabled={category.trim() === "" || isLoading}
							className='disabled:bg-dark-gradient disabled:cursor-not-allowed'
						>
							{isLoading ? "Creating..." : "Create Category"}
						</button>
					</form>
				</div>
			</main>
		</section>
	);
};

export default Dashboard;
