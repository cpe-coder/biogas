/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all files that contain Nativewind classes.
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				//color blue

				primary: "#1E40AF",
				secondary: "#3B82F6",
				accent: "#60A5FA",
				background: "#F3F4F6",
				surface: "#FFFFFF",
				error: "#EF4444",
				textPrimary: "#111827",
				textSecondary: "#6B7280",
				border: "#E5E7EB",
			},
		},
	},
	plugins: [],
};
