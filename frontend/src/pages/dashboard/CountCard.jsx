import { Link } from "react-router-dom";

const CountCard = ({ count, title, icon, path }) => {
	return (
		<div className='flex flex-col items-center flex-1 min-w-[180px] gap-2 p-3 px-5 bg-light-gradient rounded-md border-t shadow-md hover:shadow-lg hover:-translate-y-1 duration-200 ease-in-out'>
			<h3 className='font-semibold text-3xl'>+{count}</h3>
			<h5 className='text-lg text-gray-600 font-semibold'>
				{title} <i className={icon} />
			</h5>
			<Link
				className='bg-darker-gradient text-body-color px-2 py-1 rounded-md w-full text-center'
				to={path}
			>
				View all {title}
			</Link>
		</div>
	);
};

export default CountCard;
