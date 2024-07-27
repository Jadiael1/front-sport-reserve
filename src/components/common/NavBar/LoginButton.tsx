import React from 'react';
import { FaSignInAlt } from 'react-icons/fa';

interface LoginButtonProps {
	onClick: () => void;
	children?: React.ReactNode | null;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick, children = null }) => (
	<button
		onClick={onClick}
		className='hidden md:flex bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded items-center transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500'
	>
		{!children ?
			<>
				<FaSignInAlt className='mr-2' />
				<span>Login</span>
			</>
		:	children}
	</button>
);

export default LoginButton;
