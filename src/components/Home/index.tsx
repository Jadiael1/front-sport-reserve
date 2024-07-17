import { useEffect, useState } from 'react';
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

	const handleEditClick = (field: IField) => {
		navigate(`/fields/edit/${field.id}`, { state: { field } });
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
				<div className='flex items-center justify-evenly my-2 md:mx-3 border-b-2 pb-3'>
					<div className='flex items-center justify-center gap-5 w-full sm:w-3/4 md:w-1/2 lg:w-1/3'>
						<h1 className='text-blue-700 text-3xl sm:text-4xl md:text-5xl font-bold'>SportReserve</h1>
						<span className='text-4xl sm:text-5xl md:text-6xl animate-spin-slow'>
							<IoMdFootball />
						</span>
					</div>
					{user?.is_admin && (
						<button
							className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
							onClick={() => navigate('/fields/new')}
						>
							Criar novo campo
						</button>
					)}
					<button
						className='block md:hidden bg-gray-200 px-3 py-2 rounded bg-transparent'
						onClick={() => setMenuOpen(!menuOpen)}
					>
						<IoMdMenu className='text-3xl' />
					</button>

					{menuOpen && (
						<div className='absolute right-0 h-1/4 top-9 mt-10  bg-white w-full  md:max-w-md lg:max-w-lg shadow-md rounded-md py-2 z-50 '>
							<button
								className=' px-2 py-2 text-gray-800 hover:bg-gray-200 w-full flex items-center gap-3 font-bold'
								onClick={handleGoReservationList}
							>
								<FaRegListAlt className='text-base' />
								Ver minhas reservas
							</button>
							<button
								className=' mt-1 px-4 py-2 text-gray-800 hover:bg-gray-200 w-full flex items-center gap-3 bg-white  font-bold'
								onClick={logout}
							>
								<IoIosLogOut className='text-base' />
								Sair
							</button>
						</div>
					)}

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
							<IoIosLogOut className='text-base color-white' />
							Sair
						</button>
					</div>
				</div>
			:	<div className='flex justify-end mb-4 mt-5 md:mt-5'>
					<div className='flex items-center justify-evenly w-full border-b pb-3'>
						<div className='flex items-center justify-center gap-5 w-full sm:w-3/4 md:w-1/2 lg:w-1/3'>
							<h1 className='text-blue-700 text-3xl sm:text-4xl md:text-5xl font-bold'>SportReserve</h1>
							<span className='text-4xl sm:text-5xl md:text-6xl animate-spin-slow'>
								<IoMdFootball />
							</span>
						</div>
						<button
							className='flex items-center gap-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition duration-300 md:mr-16 '
							onClick={handleGoSignIn}
						>
							<CiLogin className='text-2xl' />
							Entrar
						</button>
					</div>
				</div>
			}

			<div className='text-center mb-8'>
				<h3 className='text-dark text-2xl sm:text-2xl md:text-3xl font-bold mt-5'>
					Alugue nossas quadras esportivas com facilidade.
				</h3>
				<p className='mt-5'>Escolha uma das nossas quadras </p>
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
									{field.images && field.images.length > 0 && (
										<div className='flex overflow-x-scroll'>
											{field.images.map(image => (
												<img
													key={image.id}
													src={`${baseURL}/${image.path}`.replace('api/v1/', 'public')}
													alt={field.name}
													className='w-32 h-32 object-cover mr-2 rounded'
												/>
											))}
										</div>
									)}
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
									<div className='flex justify-between mt-4'>
										<button
											className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
											onClick={() => handleRentClick(field)}
										>
											Alugar
										</button>
										{user?.is_admin && (
											<button
												className='bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-300'
												onClick={() => handleEditClick(field)}
											>
												Editar
											</button>
										)}
									</div>
								</div>
							))}
						</div>
					:	<div className='text-center text-gray-600'>
							<p>Lamentamos, ainda não temos nenhum campo disponível.</p>
							{user?.is_admin && (
								<button
									className='mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
									onClick={() => navigate('/fields/new')}
								>
									Criar novo campo
								</button>
							)}
						</div>
					}
				</div>
			:	<div className='flex items-center justify-center'>
					<div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900'></div>
				</div>
			}
		</section>
	);
};

export default HomePage;
