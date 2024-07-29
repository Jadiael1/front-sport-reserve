import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { FaSignOutAlt, FaHome, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import ProfilePhoto from '../../../assets/img/user-profile-transparent.png';
import NavItem from '../NavBar/NavItem';
import routesDash from '../../../routes/routesDash';

type TSidebarProps = {
	children: React.ReactNode;
};

const Sidebar = ({ children }: TSidebarProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);

	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsSidebarOpen(false);
			}
		};
		const handleClickOutside = (event: MouseEvent) => {
			if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
				setIsSidebarOpen(false);
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const isActive = (path: string) => {
		return location.pathname.startsWith(path) ? 'opacity-100' : 'opacity-50';
	};

	return (
		<div className='bg-gray-100 min-h-screen'>
			{/* Navbar */}
			<nav className='bg-gray-800 shadow-lg p-4 flex justify-between items-center sticky top-0 border-b-2 border-white z-50'>
				<div className='flex items-center'>
					<button
						onClick={toggleSidebar}
						className='text-xl font-bold md:hidden mr-2'
					>
						{isSidebarOpen ?
							<FaTimes className='fill-white' />
						:	<FaBars className='fill-white' />}
					</button>
				</div>
				<div className='text-xl font-bold text-white'>SportReserve</div>
			</nav>

			{/* Sidebar */}
			<div
				className={`fixed z-20 w-64 bg-gray-800 min-h-screen text-white transform ${
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				} transition-transform duration-300 ease-in-out md:translate-x-0`}
				ref={sidebarRef}
			>
				{/* User profile content */}
				<div className='bg-gray-700 p-4 text-center'>
					<img
						src={ProfilePhoto}
						alt='Foto do usuário'
						className='h-12 w-12 rounded-full mx-auto'
					/>
					<h3 className='mt-2 font-semibold'>
						{(user?.name as string).charAt(0).toUpperCase() + (user?.name as string).slice(1)}
					</h3>
				</div>

				<ul className='p-4'>
					<li className='mb-6'>
						<div
							onClick={() => (window.location.href = '/')}
							className='flex items-center justify-center py-2 cursor-pointer bg-gray-900 rounded hover:bg-gray-700 hover:text-white transition duration-200'
						>
							<FaHome className='mr-2' />
							<span>Início</span>
						</div>
					</li>
					<li className={`${isActive('/dashboard')} mb-6`}>
						<div
							onClick={() => navigate('/dashboard')}
							className='flex items-center justify-center py-2 cursor-pointer rounded-md hover:bg-gray-700 hover:text-white transition duration-200'
						>
							<FaUserCircle className='mr-2' />
							<span>Dashboard</span>
						</div>
					</li>
					{routesDash
						.filter(route => route.visibleInDisplay)
						.filter(route => route.adminOnly && user && user.is_admin)
						.map((route, index) => (
							<li
								className={`${isActive(route.path)} mb-6`}
								key={index}
							>
								<div
									onClick={() => navigate(route.path)}
									className='flex items-center py-2 cursor-pointer rounded-md pl-2 hover:bg-gray-700 hover:text-white transition duration-200'
								>
									<div className='mr-2'>
										{route.icon ?
											<route.icon />
										:	<FaHome />}
									</div>

									<span>{route.displayName}</span>
								</div>
							</li>
						))}
					<li className={`cursor-pointer rounded mt-6`}>
						<NavItem
							href='/auth/signout'
							className='flex items-center hover:text-red-900 justify-center hover:bg-gray-700 transition duration-200'
							noSpan
						>
							<FaSignOutAlt className='mr-2 fill-red-900' />
							Sair
						</NavItem>
					</li>
				</ul>
			</div>

			<main className={`p-7 md:ml-64 transition-all duration-300 ease-in-out`}>{children}</main>
		</div>
	);
};

export default Sidebar;
