import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IApiResponse, IField } from './interfaces/IFields';
import { FaFutbol, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const HomePage = () => {
	const [responseFields, setResponseFields] = useState<IApiResponse | null>(null);
	const navigate = useNavigate();
	const { user, logout, isLoading } = useAuth();
	useEffect(() => {
		fetch(`https://api-sport-reserve.juvhost.com/api/v1/fields`, {
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
		<div className='container mx-auto p-4'>
			{!isLoading && user ?
				<div>
					<button
						className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mr-2'
						onClick={handleGoReservationList}
					>
						Ver minhas reservas
					</button>
					<button
						className='bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300'
						onClick={logout}
					>
						Logout
					</button>
				</div>
			:	<div>
					<button
						className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mr-2'
						onClick={handleGoSignIn}
					>
						Entrar
					</button>
				</div>
			}

			<div className='text-center mb-8'>
				<h1 className='text-3xl font-bold mb-2'>Locação de Quadras Esportivas</h1>
				<p className='text-lg text-gray-600'>Alugue nossas quadras esportivas com facilidade e conveniência</p>
			</div>

			{responseFields ?
				<div>
					{responseFields.data.data.length ?
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{responseFields.data.data.map(field => (
								<div
									key={field.id}
									className='bg-white p-6 rounded-lg shadow-md'
								>
									<h3 className='text-xl font-semibold mb-2'>{field.name}</h3>
									<div className='text-gray-700 mb-2 flex items-center'>
										<FaMapMarkerAlt className='mr-2' />
										<span>{field.location}</span>
									</div>
									<div className='text-gray-700 mb-2 flex items-center'>
										<FaFutbol className='mr-2' />
										<span>{field.type}</span>
									</div>
									<div className='text-gray-700 mb-2 flex items-center'>
										<FaDollarSign className='mr-2' />
										<span>{field.hourly_rate}</span>
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
			:	<div className='text-center text-gray-600'>Loading...</div>}
		</div>
	);
};

export default HomePage;
