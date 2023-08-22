/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				"body-color": "#f7f7f7",
				"container-color": " #eee",
				"light-color": "#929aab",
				"dark-color": "#393e46",
				"border-color": "#ccc",
			},
			container: {
				padding: {
					DEFAULT: "1rem",
					sm: "2rem",
					lg: "4rem",
					xl: "5rem",
					"2xl": "6rem",
				},
				center: true,
			},
			backgroundImage: {
				"light-gradient": "var(--light-gradient)",
				"darker-gradient": "var(--darker-gradient)",
				"medium-gradient": "var(--medium-gradient)",
				"dark-gradient": "var(--dark-gradient)",
			},
		},
	},
	plugins: [],
};
