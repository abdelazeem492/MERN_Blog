const Popup = ({ children, popup }) => {
	return popup ? (
		<div className='pop-up'>
			<div className='pop-up-content'>{children}</div>
		</div>
	) : (
		""
	);
};

export default Popup;
