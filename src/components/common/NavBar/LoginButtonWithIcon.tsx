import React from 'react';
import LoginButton from './LoginButton';
import { FaSignInAlt } from 'react-icons/fa';

interface LoginButtonWithIconProps {
	onClick: () => void;
}

const LoginButtonWithIcon: React.FC<LoginButtonWithIconProps> = ({ onClick }) => (
	<LoginButton onClick={onClick}>
		<FaSignInAlt className='mr-2' />
		<span>Entrar</span>
	</LoginButton>
);

export default LoginButtonWithIcon;
