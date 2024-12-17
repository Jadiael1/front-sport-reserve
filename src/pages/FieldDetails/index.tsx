import {
	FaFutbol,
	FaMapMarkerAlt,
	FaDollarSign,
	FaCheckCircle,
	FaInfoCircle,
	FaExclamationTriangle,
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Alert from '../../components/common/Alert';
import DatePicker from '../../components/common/DatePicker';
import { IField } from '../../interfaces/IField';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { messageManager } from '../../components/common/Message/messageInstance';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import Navbar from '../../components/common/NavBar/NavBar';
import { IFieldAvailability } from '../../interfaces/IFieldAvailability';
import translateDaysOfTheWeek from '../../utils/translateDaysOfTheWeek';

interface FieldDetailsProps {
	field: IField;
}

const containerStyle = {
	width: '100%',
	height: '300px',
};

const initialCenter = {
	lat: -8.6855317,
	lng: -35.5914402,
};

const FieldDetails = (props?: FieldDetailsProps) => {
	const { user, token } = useAuth();
	const idParam = useParams<{ id: string }>();
	const location = useLocation();
	const [field, setField] = useState<IField | null>(location.state?.field || props?.field || null);
	const [startTime, setStartTime] = useState<string>('');
	const [endTime, setEndTime] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<{ message: string; errors?: { [key: string]: string[] } } | null>(null);
	const [success, setSuccess] = useState<{ message: string } | null>(null);
	const baseURL = import.meta.env.VITE_API_BASE_URL;
	const navigate = useNavigate();
	const [fieldAvailabilities, setFieldAvailabilities] = useState<IFieldAvailability[] | null>(null);
	// const apiIsLoaded = useApiIsLoaded();

	useEffect(() => {
		if (!field) {
			setLoading(true);
			fetch(`${baseURL}/fields/${idParam.id}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			})
				.then(resp => resp.json())
				.then(data => {
					setLoading(false);
					if (data.status === 'success') {
						setField(data.data);
					} else {
						setField(null);
						setError({ message: data.message, errors: data.errors });
					}
				})
				.catch(error => {
					setLoading(false);
					console.error('Error:', error);
					messageManager.notify({
						message: 'Erro ao realizar a reserva. Tente novamente.',
						type: 'error',
						duration: 3000,
					});
				});
		}

		setLoading(true);
		fetch(`${baseURL}/fieldAvailabilities/${idParam.id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		})
			.then(resp => resp.json())
			.then(resp => {
				if (resp.status === 'error') {
					throw new Error(resp.message);
				}
				setFieldAvailabilities(resp.data);
			})
			.catch(console.error)
			.finally(() => setLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleReservation = () => {
		if (!startTime.length || !endTime.length) {
			messageManager.notify({
				message: 'Por favor, selecione a data e hora de início e término.',
				type: 'warning',
				duration: 3000,
			});
			return;
		}
		setLoading(true);
		fetch(`${baseURL}/reservations`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				field_id: field?.id,
				start_time: startTime,
				end_time: endTime,
			}),
		})
			.then(resp => resp.json())
			.then(data => {
				setLoading(false);
				if (data.status === 'success') {
					setSuccess({ message: data.message });
				} else {
					setError({ message: data.message, errors: data.errors });
				}
			})
			.catch(error => {
				setLoading(false);
				console.error('Error:', error);
				messageManager.notify({
					message: 'Erro ao realizar a reserva. Tente novamente.',
					type: 'error',
					duration: 3000,
				});
			});
	};

	const parseLocation = (locationString: string) => {
		try {
			return JSON.parse(locationString);
		} catch (e) {
			console.error('Error parsing location:', e);
			return initialCenter;
		}
	};

	const fieldLocation = field ? parseLocation(field.location) : initialCenter;

	return (
		<>
			{idParam && !props?.field && location.state?.field ?
				<div className='mb-2'>
					<Navbar />
				</div>
			:	null}
			{success && (
				<Alert
					message={success.message}
					onClose={() => setSuccess(null)}
					type='success'
					redirectTo='/reservations'
				/>
			)}
			{error && (
				<Alert
					message={error.message}
					errors={error.errors}
					onClose={() => setError(null)}
					type='error'
				/>
			)}
			{field ?
				<div className='w-full max-w-4xl px-4 md:px-0 mx-auto'>
					<div className='bg-white p-4 md:p-6 rounded-lg shadow-md border'>
						<h1 className='text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-center'>{field.name}</h1>
						<div className='flex items-center gap-1 mb-2'>
							<FaMapMarkerAlt className='mr-2 text-red-500' />
							<h3 className='font-bold'>Localização:</h3>
							<p>
								{field.address}, {field.number}, {field.district}, {field.city} - {field.uf}, CEP: {field.cep}
							</p>
						</div>
						<div className='flex items-center gap-1 mb-2'>
							<FaFutbol className='mr-2' />
							<h3 className='font-bold'>Modalidade:</h3>
							<span>{field.type}</span>
						</div>
						<div className='flex items-center gap-1 mb-2'>
							<FaDollarSign className='mr-2 text-green-400' />
							<h3 className='font-bold'>Valor da hora:</h3>
							<span>R$ {field.hourly_rate}</span>
						</div>
						<div className='flex items-center gap-1 mb-2'>
							<FaCheckCircle className='mr-2 text-green-500' />
							<span className='font-bold'>Disponível para reservas</span>
						</div>
						<div className='flex items-center gap-1 mb-2'>
							<FaInfoCircle className='mr-2 text-blue-500' />
							<h3 className='font-bold'>Complemento:</h3>
							<p>{field.complement}</p>
						</div>
						{!loading && (
							<div className='p-4 rounded-lg shadow-md bg-white border border-gray-200 max-w mx-auto mb-4'>
								{fieldAvailabilities ?
									<>
										<h2 className='text-lg font-semibold text-gray-700 mb-4'>Disponibilidade de Campo:</h2>
										<table className='min-w-full table-auto border-collapse'>
											<thead>
												<tr>
													<th className='px-4 py-2 text-left font-medium text-sm text-gray-700 border-b border-gray-300'>
														Dia da Semana
													</th>
													<th className='px-4 py-2 text-left font-medium text-sm text-gray-700 border-b border-gray-300'>
														Hora de Início
													</th>
													<th className='px-4 py-2 text-left font-medium text-sm text-gray-700 border-b border-gray-300'>
														Hora de Fim
													</th>
												</tr>
											</thead>
											<tbody>
												{fieldAvailabilities.map((availability, index) => (
													<tr
														key={index}
														className='bg-blue-100'
													>
														<td className='px-4 py-2 text-sm border-b border-gray-200'>
															{translateDaysOfTheWeek(availability.day_of_week)}
														</td>
														<td className='px-4 py-2 text-sm border-b border-gray-200'>{availability.start_time}</td>
														<td className='px-4 py-2 text-sm border-b border-gray-200'>{availability.end_time}</td>
													</tr>
												))}
											</tbody>
										</table>
										{user && user?.is_admin && (
											<button
												onClick={() => navigate(`/dashboard/field-availabilities`)}
												className='items-center space-x-1 text-blue-500 hover:text-blue-700 mt-4'
											>
												<span>Adicionar Disponibilidades</span>
											</button>
										)}
									</>
								:	<div className='flex items-center space-x-2'>
										<FaExclamationTriangle className='text-red-500 w-5 h-5' />
										<span className='text-red-500 font-medium text-sm'>
											Este campo só poderá ser ativado se houver registro de disponibilidade.{' '}
											{user && user?.is_admin && (
												<button
													onClick={() => navigate(`/dashboard/field-availabilities`)}
													className='inline-flex items-center space-x-1 text-blue-500 hover:text-blue-700 font-semibold'
												>
													<span>Registrar</span>
												</button>
											)}
										</span>
									</div>
								}
							</div>
						)}
						<div className='mt-4'>
							<h3 className='font-bold mb-2'>Localização no Mapa:</h3>
							<Map
								style={containerStyle}
								defaultCenter={initialCenter}
								defaultZoom={15}
								gestureHandling='satellite2'
								disableDefaultUI={true}
								mapId='MAP_SR_ID_R'
								id='MAP_SR_ID_R'
							>
								<AdvancedMarker
									position={fieldLocation}
									clickable={false}
									title='Localização do Campo'
									onDrag={() => null}
									draggable={false}
								/>
							</Map>
						</div>
						<p className='text-center mt-4'>Selecione a data e hora que deseja reservar</p>
						<div className='flex items-center justify-evenly flex-wrap'>
							<div className='mt-4 relative w-full max-w-xs'>
								<DatePicker
									dateLabel={`Data de Início`}
									timeLabel={`Hora de Início`}
									value={startTime}
									onChange={value => setStartTime(value)}
								/>
							</div>
							<div className='mt-4 relative w-full max-w-xs'>
								<DatePicker
									dateLabel={`Data de Término`}
									timeLabel={`Hora de Término`}
									value={endTime}
									onChange={value => setEndTime(value)}
								/>
							</div>
						</div>
						<div className='flex flex-col items-center mt-6 md:mt-10'>
							<button
								type='submit'
								className='mt-6 w-full md:w-1/2 max-w-[250px] bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
								onClick={handleReservation}
								disabled={loading}
							>
								{loading ? 'Reservando...' : 'Reservar'}
							</button>
						</div>
					</div>
				</div>
			:	null}
		</>
	);
};

export default FieldDetails;
