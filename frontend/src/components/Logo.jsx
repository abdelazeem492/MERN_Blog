import { Link } from "react-router-dom";

const Logo = () => {
	return (
		<Link to={"/"} className='logo flex sm:text-3xl text-2xl gap-1'>
			<img src='/images/logo.svg' alt='logo' className='md:w-fit w-7' />
			<strong className='text-center'>Blog</strong>
			<i className='bi bi-pencil-fill text-xl ' />
		</Link>
	);
};

export default Logo;
