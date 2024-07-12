import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../Alert';
import { useNavigate } from 'react-router-dom';
import { IoMdHome, IoIosLogOut } from 'react-icons/io';
import { MdHourglassEmpty, MdCheckCircle, MdCancel, MdInfo } from 'react-icons/md';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
	status: string;
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
	const [paymentLink, setPaymentLink] = useState<{ id: number; url: string } | null>(null);
	const [loadingPayment, setLoadingPayment] = useState<number | null>(null);
	const navigate = useNavigate();
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	useEffect(() => {
		fetch(`${baseURL}/reservations?sort_by=created_at&sort_order=desc`, {
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
	}, [baseURL, token]);

	const handleGoHome = () => {
		navigate('/');
	};

	const handleDelete = (id: number) => {
		const confirmDelete = window.confirm('Você tem certeza que deseja excluir esta reserva?');
		if (confirmDelete) {
			fetch(`${baseURL}/reservations/${id}`, {
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
		fetch(`${baseURL}/reservations/${id}`, {
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

	const handlePayment = (id: number) => {
		setLoadingPayment(id);

		fetch(`${baseURL}/payments/reservations/${id}/pay`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
				'X-CSRF-TOKEN': '', // Adicione o valor real do CSRF token se necessário
			},
		})
			.then(resp => resp.json())
			.then(data => {
				setLoadingPayment(null);

				if (data.status === 'success' && data.data.url) {
					setPaymentLink({ id, url: data.data.url });
					setSuccess({ message: 'Link de pagamento gerado com sucesso.' });
				} else {
					setError({ message: data.message, errors: data.errors });
				}
			})
			.catch(error => {
				setLoadingPayment(null);
				console.error('Error:', error);
				setError({ message: 'Erro ao iniciar o pagamento. Tente novamente mais tarde.' });
			});
	};

	const getStatusDetails = (status: string) => {
		switch (status) {
			case 'PAID':
				return { displayName: 'Pago', color: '#28a745', icon: 'check-circle' };
			case 'WAITING':
				return {
					displayName: 'Pendente',
					color: '#ffc107',
					icon: 'hourglass-empty',
				};
			case 'CANCELED':
				return { displayName: 'Cancelado', color: '#dc3545', icon: 'cancel' };
			default:
				return { displayName: status, color: '#000', icon: 'info' };
		}
	};

	return (
		<section className='container mx-auto p-4'>
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
				<div className='flex justify-evenly items-center flex-wrap mb-8 '>
					<h1 className='text-2xl font-bold text-center sm:text-2xl lg:text-3xl md:text-4xl'>Minhas Reservas</h1>
					<div className='flex flex-wrap gap-3'>
						<button
							className='flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mr-2'
							onClick={handleGoHome}
						>
							<IoMdHome className='text-1xl' />
							Inicio
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
				{reservations.length === 0 ?
					<p className='text-gray-700'>Nenhuma reserva encontrada.</p>
				:	<div className='grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
						{reservations.map((reservation: Reservation) => {
							const statusDetails = getStatusDetails(reservation.status);
							return (
								<div
									key={reservation.id}
									className='p-4 border rounded shadow-md bg-gray-50'
								>
									{editMode === reservation.id ?
										<div>
											<div className='mt-4'>
												<label className='block text-gray-700 mb-2'>Hora de Início</label>
												<input
													type='datetime-local'
													className='w-full p-2 border rounded'
													value={editData.start_time}
													onChange={e => setEditData({ ...editData, start_time: e.target.value })}
												/>
											</div>
											<div className='mt-4'>
												<label className='block text-gray-700 mb-2'>Hora de Término</label>
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
											<h2 className='text-xl font-bold mb-2 text-center mb-3'>{reservation.field.name}</h2>
											<h3 className='text-gray-700 mb-1'>
												<span className='font-bold'>Local: </span>
												{reservation.field.location}
											</h3>
											<h3 className='text-gray-700 mb-1'>
												<span className='font-bold'>Tipo -</span> {reservation.field.type}
											</h3>
											<h3 className='flex items-center gap-3 text-gray-700 font-bold'>
												<p>Situação -</p>{' '}
												<span
													className='flex'
													style={{ color: statusDetails.color }}
												>
													{statusDetails.icon === 'check-circle' && <MdCheckCircle size={20} />}
													{statusDetails.icon === 'hourglass-empty' && <MdHourglassEmpty size={20} />}
													{statusDetails.icon === 'cancel' && <MdCancel size={20} />}
													{statusDetails.icon === 'info' && <MdInfo size={20} />}
													{statusDetails.displayName}
												</span>
											</h3>
											<h3 className='text-gray-700 mb-1 flex items-center gap-1'>
												<p className='font-bold'>Valor por Hora - </p> R$ {reservation.field.hourly_rate}
											</h3>
											<h3 className='text-gray-700 mb-1 flex items-center gap-1'>
												<p className='font-bold'>Início - </p>
												{format(new Date(reservation.start_time), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
											</h3>
											<h3 className='text-gray-700 mb-1'>
												<span className='font-bold'>Término - </span>
												{format(new Date(reservation.end_time), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
											</h3>
											<h3 className='text-gray-700'>
												<span className='font-bold'>Reservado em - </span>
												{format(new Date(reservation.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
											</h3>
											{reservation.status === 'WAITING' && (
												<>
													{paymentLink && paymentLink.id === reservation.id && (
														<p className='mt-2'>
															<a
																href={paymentLink.url}
																target='_blank'
																rel='noopener noreferrer'
																className='underline text-blue-500'
															>
																Clique aqui para pagar
															</a>
														</p>
													)}
													<button
														className={`mt-4 w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-300 ${loadingPayment === reservation.id ? 'opacity-50 cursor-not-allowed' : ''} ${paymentLink !== null ? 'opacity-50 cursor-not-allowed' : ''} `}
														onClick={() => handlePayment(reservation.id)}
														disabled={loadingPayment === reservation.id || paymentLink !== null}
													>
														{loadingPayment === reservation.id ? 'Processando...' : 'Efetuar Pagamento'}
													</button>
												</>
											)}
											<button
												className='mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
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
							);
						})}
					</div>
				}
			</div>
		</section>
	);
};

export default ReservationList;
