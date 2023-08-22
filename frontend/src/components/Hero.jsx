import { Link } from "react-router-dom";

const Hero = () => {
	return (
		<section className='hero mt-8 mb-20 relative '>
			<img
				src='/images/hero-img.jpg'
				alt='hero'
				className='rounded-xl min-h-[500px] object-cover'
			/>
			<div className='hero-content rounded-3xl'>
				<h1 className='lg:text-6xl md:text-4xl text-3xl font-bold'>
					Welcome To Your Blog
				</h1>
				<p className='text-md md:text-lg lg:text-xl text-center  md:max-w-2xl max-w-[95%] '>
					This is your blog, where you can share your thoughts and ideas with
					the world and get feedback from others on your posts. and we have a
					lot of great categories you can explore and register to create your
					own posts
				</p>
				<div className='flex gap-10 items-center'>
					<a
						href='#categories'
						className='btn text-lg text-container-color text-center border border-container-color  py-2 px-6 ease-linear duration-200 hover:bg-container-color hover:text-black'
					>
						Explore
					</a>
					<Link
						to={"/register"}
						className='btn bg-medium-gradient text-center text-lg text-black  py-2 px-6 ease-linear duration-200 '
					>
						Register
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Hero;
