import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<section className='container my-auto text-center'>
			<i className='bi bi-patch-exclamation-fill sm:text-7xl text-6xl text-red-500 block' />
			<h1 className='sm:text-4xl text-3xl font-semibold text-dark-color my-8 capitalize'>
				Error! 404{" "}
				<span className='text-red-500 sm:text-5xl text-4xl font-light'>|</span>{" "}
				Not Found
			</h1>
			<Link
				className='sm:text-lg bg-darker-gradient text-white py-2 px-4 rounded-md mt-6 block w-fit mx-auto'
				to={"/"}
			>
				Go to Home page
			</Link>
		</section>
	);
};

export default NotFound;
