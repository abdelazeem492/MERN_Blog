import { useState } from "react";

const ToTop = () => {
	const [hidden, setHidden] = useState("hidden");

	window.addEventListener("scroll", () => {
		if (window.scrollY > 300) {
			setHidden("");
		} else {
			setHidden("hidden");
		}
	});

	return (
		<button
			onClick={() => window.scrollTo(0, 0)}
			className={`fixed bottom-[10%] right-[10%] text-body-color text-lg bg-darker-gradient w-10 h-10 rounded-md ${hidden}`}
		>
			<i className='bi bi-chevron-double-up'></i>
		</button>
	);
};

export default ToTop;
