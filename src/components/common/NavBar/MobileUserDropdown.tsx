import React from 'react';
import NavItem from './NavItem';
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';

interface MobileUserDropdownProps {
	isDropdownOpen: boolean;
}

const MobileUserDropdown: React.FC<MobileUserDropdownProps> = ({ isDropdownOpen }) => {
	const { user } = useAuth();
	if (!isDropdownOpen) return null;
	return (
		<div className={`${isDropdownOpen ? 'block' : 'hidden'} text-center bg-background`}>
			{user && user.is_admin ?
				<NavItem
					href='/dashboard'
					icon={() => <FaTachometerAlt />}
					className='px-3 py-2 rounded-md text-sm hover:bg-gray-700 select-none flex items-center justify-center hover:bg-opacity-50 text-blue-700'
				>
					Dashboard
				</NavItem>
			:	null}
			<NavItem
				href='/profile'
				icon={() => <FaUserCircle className='mr-2' />}
				className='px-3 py-2 rounded-md text-sm hover:bg-gray-700 select-none flex items-center justify-center hover:bg-opacity-50 text-blue-700'
			>
				Perfil
			</NavItem>
			<NavItem
				href='/auth/signout'
				icon={() => <FaSignOutAlt className='mr-2' />}
				className='px-3 py-2 rounded-md text-sm hover:bg-gray-700 select-none flex items-center justify-center hover:bg-opacity-50 text-blue-700'
			>
				Sair
			</NavItem>
		</div>
	);
};

export default MobileUserDropdown;
