import React from "react";
import { Link } from "react-router-dom";

const AboutUsPage = () => {
	return (
		<div className='container '>
			<h1 className='heading'>About Us</h1>
			<div className='flex flex-wrap md:flex-nowrap justify-between items-center'>
				<div className='flex flex-col justify-between gap-6 text-gray-600'>
					<p className='text-lg mb-2 '>
						Welcome to our blog website! We are a team of passionate writers,
						covering various niches to provide you with valuable and engaging
						content.
					</p>
					<p className='w-full border-b border-border-color' />
					<p className='text-lg mb-2'>
						Whether you're interested in technology, fashion, travel, or any
						other niche, we've got you covered. Our goal is to deliver
						high-quality articles and keep you informed and entertained.
					</p>
					<p className='w-full border-b border-border-color' />
					<p className='text-lg'>
						Thank you for visiting our blog. We hope you enjoy reading our posts
						as much as we enjoy creating them!
					</p>
					<p className='w-full border-b border-border-color' />
					<div className='flex gap-10  items-center'>
						<Link
							to={"/register"}
							className='rounded-lg md:text-lg text-container-color bg-darker-gradient text-center   py-2 px-6 ease-linear duration-200 hover:opacity-100 hover:text-body-color opacity-90'
						>
							Register
						</Link>
						<Link
							to='/posts'
							className='rounded-lg md:text-lg text-container-color bg-blue-600 text-center   py-2 px-8 ease-linear duration-200 hover:opacity-100 hover:text-body-color opacity-90'
						>
							Posts
						</Link>
					</div>
				</div>
				<img
					src='/images/about.png'
					alt=''
					className='md:max-w-[50%] max-w-[100%]'
				/>
			</div>
		</div>
	);
};

export default AboutUsPage;
