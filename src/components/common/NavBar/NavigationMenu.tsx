import routesSite from '../../../routes/routesSite';
import NavItem from './NavItem';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../../hooks/useAuth';

type TNavigationMenu = {
	className?: string;
	merge?: boolean;
	defaultClassName?: boolean;
};

const NavigationMenu = ({ className, merge = false, defaultClassName = false }: TNavigationMenu) => {
	const defaultClassNameValue = defaultClassName ? 'hidden md:flex' : '';
	const { user } = useAuth();
	return (
		<div className={merge ? twMerge(defaultClassNameValue, className) : `${defaultClassNameValue} ${className}`}>
			{routesSite
				.filter(route => route.visibleInDisplay)
				.filter(route => !route.adminOnly || (route.adminOnly && user && user.is_admin))
				.map(route => (
					<NavItem
						key={route.path}
						href={route.path}
						icon={() => (route.icon ? <route.icon /> : <></>)}
						className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:bg-gray-700 hover:text-blue-700 ${
							location.pathname === route.path ? 'opacity-100' : 'opacity-50'
						}`}
					>
						{route.displayName}
					</NavItem>
				))}
		</div>
	);
};

export default NavigationMenu;
