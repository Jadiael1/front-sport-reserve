import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { IoMdMenu, IoIosLogOut, IoMdFootball } from 'react-icons/io';
import { CiLogin } from 'react-icons/ci';
import { useState } from 'react';

const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);

	const handleGoReservationList = () => {
		navigate('/reservations');
		if (menuOpen) setMenuOpen(false);
	};

	const handleLogout = () => {
		logout();
		if (menuOpen) setMenuOpen(false);
	};

	const handleGoSignIn = () => {
		navigate('/signin');
	};

	const handleGoHome = () => {
		navigate('/');
	};

	return (
		<nav className='bg-background border-b border-gray-200'>
			<div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
				<div
					className='flex items-center space-x-3 rtl:space-x-reverse cursor-pointer'
					onClick={handleGoHome}
				>
					<IoMdFootball className='h-8 w-8 text-blue-700' />
					<span
						className='self-center text-2xl font-semibold whitespace-nowrap'
						onClick={handleGoHome}
					>
						SportReserve
					</span>
				</div>
				<button
					data-collapse-toggle='navbar-default'
					type='button'
					className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
					aria-controls='navbar-default'
					aria-expanded={menuOpen ? 'true' : 'false'}
					onClick={() => setMenuOpen(!menuOpen)}
				>
					<span className='sr-only'>Open main menu</span>
					<IoMdMenu className='w-5 h-5' />
				</button>
				<div
					className={`${menuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`}
					id='navbar-default'
				>
					<ul className='font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent dark:border-gray-700'>
						{user ?
							<>
								{user.is_admin && (
									<li>
										<button
											className='block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 transition duration-300'
											onClick={() => {
												navigate('/fields/new');
												setMenuOpen(false);
											}}
										>
											Criar novo campo
										</button>
									</li>
								)}
								<li>
									<button
										className='block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 transition duration-300'
										onClick={handleGoReservationList}
									>
										Ver minhas reservas
									</button>
								</li>
								<li>
									<button
										className='flex items-center py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 transition duration-300'
										onClick={handleLogout}
									>
										<IoIosLogOut className='text-base mr-1' />
										Sair
									</button>
								</li>
							</>
						:	<li>
								<button
									className='flex items-center justify-center gap-1 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition duration-300'
									onClick={handleGoSignIn}
								>
									<CiLogin className='text-2xl' />
									Entrar
								</button>
							</li>
						}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
