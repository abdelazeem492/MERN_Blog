import { useEffect } from "react";

export default function useClickOutside(ref, callback) {
	useEffect(() => {
		const listener = (event) => {
			const element = ref?.current;
			if (element && !element.contains(event.target)) {
				callback(event);
			}
		};
		document.addEventListener("mousedown", listener, true);
		document.addEventListener("touchstart", listener, true);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, callback]);
}
