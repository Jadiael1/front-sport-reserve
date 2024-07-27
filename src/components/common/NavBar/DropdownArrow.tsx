import React from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

interface DropdownArrowProps {
	isOpen: boolean;
}

const DropdownArrow: React.FC<DropdownArrowProps> = ({ isOpen }) =>
	isOpen ?
		<FaAngleUp className='ml-1 h-4 w-4 transition duration-300 ease-in-out text-blue-700' />
	:	<FaAngleDown className='ml-1 h-4 w-4 transition duration-300 ease-in-out opacity-80 text-blue-700' />;

export default DropdownArrow;
