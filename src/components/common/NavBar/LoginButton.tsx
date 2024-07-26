import React from 'react';
import { FaSignInAlt } from 'react-icons/fa';

interface LoginButtonProps {
	onClick: () => void;
	children?: React.ReactNode | null;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick, children = null }) => (
	<button
		onClick={onClick}
		className='hidden md:flex bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded items-center transition duration-300 ease-in-out'
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
