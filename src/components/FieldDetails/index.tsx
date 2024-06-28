import { useLocation } from 'react-router-dom';
import { FaFutbol, FaMapMarkerAlt, FaDollarSign, FaClock } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../Alert';

const FieldDetails = () => {
	const location = useLocation();
	const { field } = location.state;
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const { token } = useAuth();
	const [error, setError] = useState<{ message: string; errors?: { [key: string]: string[] } } | null>(null);
	const [success, setSuccess] = useState<{ message: string } | null>(null);

	const handleReservation = () => {
		const startTimeTreated = new Date(startTime).toISOString().replace('T', ' ').slice(0, 19);
		const endTimeTreated = new Date(endTime).toISOString().replace('T', ' ').slice(0, 19);
		fetch('https://api-sport-reserve.juvhost.com/api/v1/reservations', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				field_id: field.id,
				start_time: startTimeTreated,
				end_time: endTimeTreated,
			}),
		})
			.then(resp => resp.json())
			.then(data => {
				if (data.status === 'success') {
					setSuccess({ message: data.message });
				} else {
					setError({ message: data.message, errors: data.errors });
				}
			})
			.catch(error => {
				console.error('Error:', error);
				alert('Erro ao realizar a reserva. Tente novamente.');
			});
	};

	return (
		<div className='container mx-auto p-4'>
			{success && (
				<Alert
					message={success.message}
					onClose={() => setError(null)}
					type='success'
					redirectTo='/'
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
			<div className='bg-white p-6 rounded-lg shadow-md'>
				<h1 className='text-3xl font-bold mb-4'>{field.name}</h1>
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
				<div className='text-gray-700 mb-2 flex items-center'>
					<FaClock className='mr-2' />
					<span>Disponível para reservas</span>
				</div>

				<div className='mt-4'>
					<label className='block text-gray-700 mb-2'>Hora de Início:</label>
					<input
						type='datetime-local'
						className='w-full p-2 border rounded'
						value={startTime}
						onChange={e => setStartTime(e.target.value)}
					/>
				</div>
				<div className='mt-4'>
					<label className='block text-gray-700 mb-2'>Hora de Término:</label>
					<input
						type='datetime-local'
						className='w-full p-2 border rounded'
						value={endTime}
						onChange={e => setEndTime(e.target.value)}
					/>
				</div>
				<button
					className='mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
					onClick={handleReservation}
				>
					Confirmar Reserva
				</button>
			</div>
		</div>
	);
};

export default FieldDetails;
