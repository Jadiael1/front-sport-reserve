import { FaFutbol, FaMapMarkerAlt, FaDollarSign, FaCheckCircle } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../Alert';
import { DatePicker } from 'antd';
import { FieldDetailsProps } from '../Home/interfaces/IFields';

const FieldDetails = ({ field }: FieldDetailsProps) => {
	const { token } = useAuth();
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<{ message: string; errors?: { [key: string]: string[] } } | null>(null);
	const [success, setSuccess] = useState<{ message: string } | null>(null);
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	const handleReservation = () => {
		setLoading(true);
		fetch(`${baseURL}/reservations`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				field_id: field.id,
				start_time: startTime,
				end_time: endTime,
			}),
		})
			.then(resp => resp.json())
			.then(data => {
				if (data.status === 'success') {
					setSuccess({ message: data.message });
				} else {
					setLoading(false);
					setError({ message: data.message, errors: data.errors });
				}
			})
			.catch(error => {
				console.error('Error:', error);
				alert('Erro ao realizar a reserva. Tente novamente.');
			});
	};

	return (
		<>
			{success && (
				<Alert
					message={success.message}
					onClose={() => setError(null)}
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

			<div className='w-full max-w-4xl px-4 md:px-0'>
				<div className='bg-white p-6 rounded-lg shadow-md border mt-10'>
					<h1 className='text-3xl font-bold mb-4 text-center'>{field.name}</h1>
					<div className='flex items-center gap-1 mb-2'>
						<FaMapMarkerAlt className='mr-2 text-red-500' />
						<h3 className='font-bold'>Localização:</h3>
						<p>{field.location}</p>
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
					<p className='text-center '>Selecione a data e hora que deseja reservar</p>
					<div className='flex items-center justify-evenly flex-wrap'>
						<div className='mt-4 relative w-full max-w-xs '>
							<label className='absolute text-sm text-dark-500 bg-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1'>
								Hora de Início
							</label>
							{/* <input
								type='datetime-local'
								className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none dark:text-dark dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
								value={startTime}
								onChange={e => setStartTime(e.target.value)}
							/> */}
							<DatePicker
								showTime={{ format: 'HH:mm' }}
								format='DD/MM/YYYY HH:mm'
								placeholder=''
								value={startTime}
								onChange={value => setStartTime(value)}
								className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none dark:text-dark dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							/>
						</div>
						<div className='mt-4 relative w-full max-w-xs '>
							<label className='absolute text-sm text-dark-500 bg-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1'>
								Hora de Término
							</label>
							{/* <input
								type='datetime-local'
								className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none dark:text-dark dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
								value={endTime}
								onChange={e => setEndTime(e.target.value)}
							/> */}
							<DatePicker
								showTime={{ format: 'HH:mm' }}
								format='DD/MM/YYYY HH:mm'
								placeholder=''
								value={endTime}
								onChange={value => setEndTime(value)}
								className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none dark:text-dark dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							/>
						</div>
					</div>

					<div className='flex flex-col items-center mt-10'>
						<button
							type='submit'
							className='mt-6 w-full md:w-1/2 max-w-[250px] bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
							onClick={handleReservation}
							disabled={loading}
						>
							{loading ? 'Reservando...' : 'Reservar'}
							{/* // Confirmar Reserva */}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default FieldDetails;
