// Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { IoMdMenu, IoIosLogOut } from 'react-icons/io';
import { useState } from 'react';

export const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);

	const handleGoReservationList = () => {
		navigate(`/reservations`);
		if (menuOpen) setMenuOpen(false);
	};

	const handleLogout = () => {
		logout();
		if (menuOpen) setMenuOpen(false);
	};

	return (
		<nav className='flex items-center gap-5'>
			<button
				className='block md:hidden bg-gray-200 px-3 py-2 rounded bg-transparent'
				onClick={() => setMenuOpen(!menuOpen)}
			>
				<IoMdMenu className='text-3xl' />
			</button>

			{menuOpen && (
				<div className='absolute right-0 top-14 mt-6 bg-white w-full md:max-w-md lg:max-w-lg shadow-md rounded-md py-2 z-50'>
					{user?.is_admin && (
						<button
							className='mt-1 px-4 py-2 text-gray-800 hover:bg-gray-200 w-full bg-white font-bold'
							onClick={() => {
								navigate('/fields/new');
								setMenuOpen(false);
							}}
						>
							Criar novo campo
						</button>
					)}

					<button
						className='px-2 py-2 text-gray-800 hover:bg-gray-200 w-full gap-3 font-bold'
						onClick={handleGoReservationList}
					>
						Ver minhas reservas
					</button>

					<button
						className='mt-1 px-4 py-2 text-gray-800 hover:bg-gray-200 w-full  gap-3 bg-white font-bold'
						onClick={handleLogout}
					>
						{/* <IoIosLogOut className='text-base' /> */}
						Sair
					</button>
				</div>
			)}

			<div className='hidden md:flex items-center gap-5'>
				{user?.is_admin && (
					<button
						className='font-bold hover:opacity-60'
						onClick={() => {
							navigate('/fields/new');
							setMenuOpen(false);
						}}
					>
						Criar novo campo
					</button>
				)}
				<button
					className='text-dark py-2 px-4 font-bold rounded transition duration-300 flex items-center gap-3 hover:opacity-60'
					onClick={handleGoReservationList}
				>
					Ver minhas reservas
				</button>

				<button
					className='bg-black text-white py-2 px-4 font-bold  rounded border border-transparent hover:border-black hover:text-black hover:bg-transparent transition duration-300 flex items-center gap-3'
					onClick={handleLogout}
				>
					<IoIosLogOut className='text-base' />
					Sair
				</button>
			</div>
		</nav>
	);
};
