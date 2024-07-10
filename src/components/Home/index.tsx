import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IApiResponse, IField } from './interfaces/IFields';
import { FaFutbol, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { CiLogin } from 'react-icons/ci';
import { IoMdFootball, IoMdMenu, IoIosLogOut } from 'react-icons/io';
import { FaRegListAlt } from 'react-icons/fa';

const HomePage = () => {
	const { user, logout, isLoading } = useAuth();
	const [responseFields, setResponseFields] = useState<IApiResponse | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const baseURL = import.meta.env.VITE_API_BASE_URL;
	const navigate = useNavigate();

	useEffect(() => {
		fetch(`${baseURL}/fields`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		})
			.then(resp => resp.json())
			.then(resp => setResponseFields(resp))
			.catch(err => console.error(err));
	}, []);

	const handleRentClick = (field: IField) => {
		navigate(`/field/${field.id}`, { state: { field } });
	};

	const handleGoReservationList = () => {
		navigate(`/reservations`);
	};

	const handleGoSignIn = () => {
		navigate(`/signin`);
	};

	return (
		<section className='mx-auto p-4 w-full bg-background min-h-screen'>
			{!isLoading && user ?
				<div className='flex items-center justify-end my-5 md:mx-10'>
					<button
						className='block md:hidden bg-gray-200 px-3 py-2 rounded bg-transparent'
						onClick={() => setMenuOpen(!menuOpen)}
					>
						<IoMdMenu className='text-3xl' />
					</button>
					{/* Menu visível em telas menores */}
					{menuOpen && (
						// Div do menu responsivo
						<div className='absolute right-0 h-1/4 top-9 mt-8  bg-white w-full  md:max-w-md lg:max-w-lg shadow-md rounded-md py-2 z-50 '>
							<button
								className='block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full flex items-center gap-3 bg-slate-300 font-bold'
								onClick={handleGoReservationList}
							>
								<FaRegListAlt className='text-base' />
								Ver minhas reservas
							</button>
							<button
								className=' mt-1 px-4 py-2 text-gray-800 hover:bg-gray-200 w-full flex items-center gap-3 bg-white bg-slate-300 font-bold'
								onClick={logout}
							>
								<IoIosLogOut className='text-base' />
								Logout
							</button>
						</div>
					)}
					{/* Botões para telas maiores */}
					<div className='hidden md:flex items-center gap-5'>
						<button
							className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mr-2 flex items-center gap-3'
							onClick={handleGoReservationList}
						>
							<FaRegListAlt className='text-base' />
							Ver minhas reservas
						</button>
						<button
							className='bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 flex items-center gap-3'
							onClick={logout}
						>
							<IoIosLogOut className='text-base color-white text-lg' />
							Sair
						</button>
					</div>
				</div>
			:	<div className='flex justify-end mb-4 mt-5 md:mt-5'>
					<button
						className='flex items-center gap-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition duration-300 md:mr-16 '
						onClick={handleGoSignIn}
					>
						<CiLogin />
						Entrar
					</button>
				</div>
			}

			<div className='text-center mb-8'>
				<div className='flex items-center justify-center gap-5 w-full'>
					<h1 className='text-3xl font-bold mb-2'>
						<span className='text-primary text-5xl'>SportReserve </span>
					</h1>
					<span className='text-5xl animate-spin'>
						<IoMdFootball />
					</span>
				</div>
				<p className='text-lg text-text mt-5'>Alugue nossas quadras esportivas com facilidade.</p>
			</div>

			{/* Conteúdo dos campos */}
			{responseFields ?
				<div className='flex items-center justify-evenly'>
					{responseFields.data.data.length ?
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6 w-3/4 mt-12'>
							{responseFields.data.data.map(field => (
								<div
									key={field.id}
									className='bg-white p-6 rounded-lg shadow-md max-w-xs md:max-w-md lg:max-w-lg'
								>
									<h3 className='text-xl font-semibold mb-2 text-center'>{field.name}</h3>
									<div className='text-gray-700 mb-2 flex items-center'>
										<FaMapMarkerAlt className='mr-2 text-red-500' />
										<p>{field.location}</p>
									</div>
									<div className='text-gray-700 mb-2 flex items-center'>
										<FaFutbol className='mr-2' />
										<span>{field.type}</span>
									</div>
									<div className='text-gray-700 mb-2 flex items-center'>
										<FaDollarSign className='mr-2 text-green-400' />
										<span>R$ {field.hourly_rate}</span>
									</div>
									<button
										className='mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
										onClick={() => handleRentClick(field)}
									>
										Alugar
									</button>
								</div>
							))}
						</div>
					:	<div className='text-center text-gray-600'>Lamentamos, ainda não temos nenhum campo disponível.</div>}
				</div>
			:	<div className='flex items-center justify-center'>
					<div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900'></div>
				</div>
			}
		</section>
	);
};

export default HomePage;
