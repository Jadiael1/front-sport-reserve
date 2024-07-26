import React from 'react';
import UserAvatar from './UserAvatar';
import DropdownArrow from './DropdownArrow';

interface UserDropdownProps {
	userName: string;
	isDropdownOpen: boolean;
	toggleDropdown: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ userName, isDropdownOpen, toggleDropdown }) => (
	<div
		className='flex items-center cursor-pointer'
		onClick={toggleDropdown}
	>
		<UserAvatar />
		<span className={`ml-2 font-semibold text-lg ${isDropdownOpen ? 'opacity-90' : 'opacity-80'} hover:opacity-90`}>
			{userName.charAt(0).toUpperCase() + userName.slice(1)}
		</span>
		<DropdownArrow isOpen={isDropdownOpen} />
	</div>
);

export default UserDropdown;
