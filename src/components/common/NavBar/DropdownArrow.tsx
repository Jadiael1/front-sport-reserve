import React from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

interface DropdownArrowProps {
	isOpen: boolean;
}

const DropdownArrow: React.FC<DropdownArrowProps> = ({ isOpen }) =>
	isOpen ?
		<FaAngleUp className='ml-1 h-4 w-4 transition duration-300' />
	:	<FaAngleDown className='ml-1 h-4 w-4 transition duration-300 opacity-80' />;

export default DropdownArrow;
