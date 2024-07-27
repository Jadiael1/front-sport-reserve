import React from 'react';
import { twMerge } from 'tailwind-merge';

interface IconButtonProps {
	onClick: () => void;
	icon: React.ReactNode;
	className?: string;
	merge?: boolean;
	defaultClassName?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
	onClick,
	icon,
	merge = false,
	className = '',
	defaultClassName = false,
	...props
}) => {
	const classNameDefault = defaultClassName ? 'focus:outline-none focus:ring-2 focus:ring-blue-500' : '';
	return (
		<button
			onClick={onClick}
			className={merge ? twMerge(classNameDefault, className) : `${classNameDefault} ${className}`}
			{...props}
		>
			{icon}
		</button>
	);
};

export default IconButton;
