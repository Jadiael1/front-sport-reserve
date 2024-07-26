import React, { ComponentProps } from 'react';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../../hooks/useAuth';

export type NavItemProps = ComponentProps<'a'> & {
	children: React.ReactNode;
	merge?: boolean;
	icon?: () => JSX.Element;
	noSpan?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({
	icon: Icon,
	className,
	children,
	merge = false,
	noSpan = false,
	...props
}: NavItemProps) => {
	const navigate = useNavigate();
	const { logout } = useAuth();
	return (
		<a
			className={
				merge ?
					twMerge(
						'flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:bg-gray-700 text-white',
						className,
					)
				:	className
			}
			onClick={(evt: React.MouseEvent<HTMLAnchorElement>) => {
				evt.preventDefault();
				if (props.href === '/auth/signout') {
					logout();
					return;
				}
				props.href && navigate(props.href);
			}}
			{...props}
		>
			{Icon ?
				<Icon />
			:	null}
			{noSpan ? children : <span className='ml-1'>{children}</span>}
		</a>
	);
};

export default NavItem;
