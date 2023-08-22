import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
	return (
		<Link
			to={`/categories/${category.title}`}
			className='rounded-lg border border-border-color text-dark-color flex justify-center items-center md:text-2xl text-xl font-semibold h-28 hover:shadow-lg ease-in-out duration-300 hover:-translate-y-1'
		>
			<div className='category capitalize'>
				<p>{category?.title}</p>
			</div>
		</Link>
	);
};

export default CategoryCard;
