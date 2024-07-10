/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{ts,tsx}', // Procura por classes Tailwind em todos os arquivos JS, JSX, TS, e TSX dentro da pasta src
		'./src/components/atoms/**/*.{ts,tsx}', // Procura especificamente dentro da pasta atoms
		'./src/components/molecules/**/*.{ts,tsx}', // Procura especificamente dentro da pasta molecules
		'./src/components/organisms/**/*.{ts,tsx}', // Procura especificamente dentro da pasta organisms
		'./src/components/templates/**/*.{ts,tsx}', // Procura especificamente dentro da pasta templates
		'./src/components/pages/**/*.{ts,tsx}', // Procura especificamente dentro da pasta pages
	],
	theme: {
		extend: {
			screens: {
				xs: '275px',
			},
			colors: {
				primary: '#1E90FF', // Dodger Blue
				secondary: '#FF4500', // Orange Red
				accent: '#32CD32', // Lime Green
				background: '#F0F8FF', // Alice Blue
				text: '#333333', // Dark Gray
				muted: '#666666', // Gray
			},
			fontFamily: {
				sans: ['Poppins', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
