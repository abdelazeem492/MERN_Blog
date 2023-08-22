import Logo from "./Logo";

const Footer = () => {
	return (
		<footer className=' sm:text-sm mt-auto bg-light-gradient border-t border-border-color sm:py-3 py-2 z-10'>
			<div className='container flex sm:flex-row flex-col justify-between items-center gap-2'>
				<Logo />
				<p className='text-dark-color text-center sm:text-base text-sm'>
					<b className='text-dark-color'>@Abdelazim Hassan </b> 2023. All Right
					Reserved
				</p>
			</div>
		</footer>
	);
};

export default Footer;
