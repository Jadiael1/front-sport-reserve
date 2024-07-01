import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../Alert';
import { useNavigate } from 'react-router-dom';

interface Field {
	id: number;
	name: string;
	location: string;
	type: string;
	hourly_rate: string;
	created_at: string | null;
	updated_at: string | null;
}

interface Reservation {
	id: number;
	user_id: number;
	field_id: number;
	start_time: string;
	end_time: string;
	created_at: string;
	updated_at: string;
	status: 'pending'|'paid';
	field: Field;
}

interface ApiResponse {
	status: string;
	message: string;
	data: {
		current_page: number;
		data: Reservation[];
		first_page_url: string;
		from: number;
		last_page: number;
		last_page_url: string;
		next_page_url: string | null;
		path: string;
		per_page: number;
		prev_page_url: string | null;
		to: number;
		total: number;
	};
	errors: { [key: string]: string[] } | null;
}

const ReservationList = () => {
	const { token, logout } = useAuth();
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [error, setError] = useState<{ message: string; errors?: string | { [key: string]: string[] } | null } | null>(
		null,
	);
	const [success, setSuccess] = useState<{ message: string } | null>(null);
	const [editMode, setEditMode] = useState<number | null>(null);
	const [editData, setEditData] = useState<{ start_time: string; end_time: string }>({
		start_time: '',
		end_time: '',
	});
	const navigate = useNavigate();

	useEffect(() => {
		fetch('https://api-sport-reserve.juvhost.com/api/v1/reservations', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then(resp => resp.json())
			.then((data: ApiResponse) => {
				if (data.status === 'success') {
					setReservations(data.data.data);
				} else {
					setError({ message: data.message, errors: data.errors });
				}
			})
			.catch(error => {
				console.error('Error:', error);
				setError({ message: 'Erro ao buscar as reservas. Tente novamente mais tarde.' });
			});
	}, [token]);

	const handleGoHome = () => {
		navigate('/');
	};

	const handleDelete = (id: number) => {
		const confirmDelete = window.confirm('Você tem certeza que deseja excluir esta reserva?');
		if (confirmDelete) {
			fetch(`https://api-sport-reserve.juvhost.com/api/v1/reservations/${id}`, {
				method: 'DELETE',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
				.then(resp => resp.json())
				.then((data: ApiResponse) => {
					if (data.status === 'success') {
						setSuccess({ message: data.message });
						setReservations(reservations.filter(reservation => reservation.id !== id));
					} else {
						setError({ message: data.message });
					}
				})
				.catch(error => {
					console.error('Error:', error);
					setError({ message: 'Erro ao excluir a reserva. Tente novamente mais tarde.' });
				});
		}
	};

	const handleEdit = (id: number) => {
		setEditMode(id);
		const reservation = reservations.find(reservation => reservation.id === id);
		if (reservation) {
			setEditData({
				start_time: reservation.start_time,
				end_time: reservation.end_time,
			});
		}
	};

	const handleUpdate = (id: number) => {
		fetch(`https://api-sport-reserve.juvhost.com/api/v1/reservations/${id}`, {
			method: 'PATCH',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(editData),
		})
			.then(resp => resp.json())
			.then((data: ApiResponse) => {
				if (data.status === 'success') {
					setReservations(
						reservations.map(reservation => (reservation.id === id ? { ...reservation, ...data.data } : reservation)),
					);
					setEditMode(null);
				} else {
					setError({ message: data.message });
				}
			})
			.catch(error => {
				console.error('Error:', error);
				setError({ message: 'Erro ao atualizar a reserva. Tente novamente mais tarde.' });
			});
	};

	return (
		<div className='container mx-auto p-4'>
			{error && (
				<Alert
					message={error.message}
					onClose={() => setError(null)}
					type='error'
				/>
			)}
			{success && (
				<Alert
					message={success.message}
					onClose={() => setSuccess(null)}
					type='success'
				/>
			)}
			<div className='bg-white p-6 rounded-lg shadow-md'>
				<div className='flex justify-between items-center mb-4'>
					<h1 className='text-3xl font-bold'>Minhas Reservas</h1>
					<div>
						<button
							className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mr-2'
							onClick={handleGoHome}
						>
							Ir para Página Inicial
						</button>
						<button
							className='bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300'
							onClick={logout}
						>
							Logout
						</button>
					</div>
				</div>
				{reservations.length === 0 ?
					<p className='text-gray-700'>Nenhuma reserva encontrada.</p>
				:	<div className='grid gap-4'>
						{reservations.map((reservation: Reservation) => (
							<div
								key={reservation.id}
								className='p-4 border rounded'
							>
								{editMode === reservation.id ?
									<div>
										<div className='mt-4'>
											<label className='block text-gray-700 mb-2'>Hora de Início:</label>
											<input
												type='datetime-local'
												className='w-full p-2 border rounded'
												value={editData.start_time}
												onChange={e => setEditData({ ...editData, start_time: e.target.value })}
											/>
										</div>
										<div className='mt-4'>
											<label className='block text-gray-700 mb-2'>Hora de Término:</label>
											<input
												type='datetime-local'
												className='w-full p-2 border rounded'
												value={editData.end_time}
												onChange={e => setEditData({ ...editData, end_time: e.target.value })}
											/>
										</div>
										<button
											className='mt-4 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300'
											onClick={() => handleUpdate(reservation.id)}
										>
											Atualizar
										</button>
										<button
											className='mt-2 w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300'
											onClick={() => setEditMode(null)}
										>
											Cancelar
										</button>
									</div>
								:	<div>
										<h2 className='text-xl font-bold mb-2'>{reservation.field.name}</h2>
										<p className='text-gray-700 mb-1'>
											<strong>Local:</strong> {reservation.field.location}
										</p>
										<p className='text-gray-700 mb-1'>
											<strong>Tipo:</strong> {reservation.field.type}
										</p>
										<p className='text-gray-700 mb-1'>
											<strong>Status:</strong> {reservation.status}
										</p>
										<p className='text-gray-700 mb-1'>
											<strong>Taxa por Hora:</strong> {reservation.field.hourly_rate}
										</p>
										<p className='text-gray-700 mb-1'>
											<strong>Início:</strong> {reservation.start_time}
										</p>
										<p className='text-gray-700 mb-1'>
											<strong>Término:</strong> {reservation.end_time}
										</p>
										<p className='text-gray-700'>
											<strong>Reservado em:</strong> {reservation.created_at}
										</p>
										<button
											className='mt-4 w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-300'
											onClick={() => handleEdit(reservation.id)}
										>
											Editar
										</button>
										<button
											className='mt-2 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300'
											onClick={() => handleDelete(reservation.id)}
										>
											Excluir
										</button>
									</div>
								}
							</div>
						))}
					</div>
				}
			</div>
		</div>
	);
};

export default ReservationList;
