import { useState, useEffect } from 'react';
import { FaPrint } from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';
import { IReservation } from '../../../interfaces/IReservation';
import Sidebar from '../../../components/common/Sidebar';
import translateDaysOfTheWeek from '../../../utils/translateDaysOfTheWeek';

const ReservationFilterPage = () => {
	// Estado para armazenar dados
	const [dayOfWeek, setDayOfWeek] = useState(getCurrentDayOfWeek());
	const [status, setStatus] = useState('PAID');
	const [reservations, setReservations] = useState<IReservation[] | null>(null);
	const [loading, setLoading] = useState(false);
	const baseURL = import.meta.env.VITE_API_BASE_URL;
	const { token } = useAuth();

	// Função para obter o dia da semana atual (usando Date para pegar o dia da semana)
	function getCurrentDayOfWeek() {
		const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
		return days[new Date().getDay()];
	}

	// Chama a função de busca sempre que `dayOfWeek` ou `status` mudar
	useEffect(() => {
		// Função para carregar as reservas
		const fetchReservations = async () => {
			setLoading(true);
			try {
				const response = await fetch(`${baseURL}/reservations/day-filter?day_of_week=${dayOfWeek}&status=${status}`, {
					method: 'GET',
					headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
				});
				const data = await response.json();
				if (data.status === 'success') setReservations(data.data);
			} catch (error) {
				console.error('Error fetching reservations:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchReservations();
	}, [dayOfWeek, status, baseURL, token]);

	// Função para gerar a impressão
	const printReservations = () => {
		const printWindow = window.open('', '', 'height=600,width=800');
		printWindow?.document.write('<html><head><title>Reservas</title>');
		printWindow?.document.write(
			'<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css" rel="stylesheet">',
		);
		printWindow?.document.write('</head><body>');
		printWindow?.document.write('<h1 class="text-center text-2xl font-bold mb-4">Lista de Reservas</h1>');
		printWindow?.document.write('<table class="min-w-full table-auto border-collapse border border-gray-300">');
		printWindow?.document.write(
			'<thead><tr class="bg-gray-100"><th class="border px-4 py-2">ID</th><th class="border px-4 py-2">Usuário</th><th class="border px-4 py-2">Campo</th><th class="border px-4 py-2">Status</th><th class="border px-4 py-2">Data de Início</th><th class="border px-4 py-2">Data de Fim</th></tr></thead><tbody>',
		);
		reservations?.forEach(reservation => {
			printWindow?.document.write(
				`<tr><td class="border px-4 py-2">${reservation?.id}</td><td class="border px-4 py-2">${reservation.user.name}</td><td class="border px-4 py-2">${reservation.field.name}</td><td class="border px-4 py-2">${reservation.status}</td><td class="border px-4 py-2">${new Date(reservation.start_time).toLocaleString()}</td><td class="border px-4 py-2">${new Date(reservation.end_time).toLocaleString()}</td></tr>`,
			);
		});
		printWindow?.document.write('</tbody></table>');
		printWindow?.document.write('</body></html>');
		printWindow?.document.close();
		printWindow?.print();
	};

	return (
		<Sidebar>
			<div className='p-6 max-w-4xl mx-auto'>
				<h1 className='text-3xl font-semibold mb-6 text-center'>Filtrar Reservas</h1>

				<div className='mb-6 flex justify-between items-center'>
					<div>
						<label
							htmlFor='day_of_week'
							className='block text-sm font-medium text-gray-700'
						>
							Dia da Semana
						</label>
						<select
							id='day_of_week'
							value={dayOfWeek}
							onChange={e => setDayOfWeek(e.target.value)}
							className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
						>
							{['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(day => (
								<option
									key={day}
									value={day}
								>
									{translateDaysOfTheWeek(day)}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor='status'
							className='block text-sm font-medium text-gray-700'
						>
							Status
						</label>
						<select
							id='status'
							value={status}
							onChange={e => setStatus(e.target.value)}
							className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
						>
							<option value='PAID'>Pagas</option>
							<option value='WAITING'>Aguardando</option>
							<option value='CANCELED'>Canceladas</option>
						</select>
					</div>
				</div>

				{loading ?
					<div className='text-center'>Carregando reservas...</div>
				:	<>
						{reservations && reservations.length > 0 ?
							<>
								<div className='overflow-x-auto hidden lg:block'>
									<table className='min-w-full table-auto border-collapse border border-gray-300'>
										<thead>
											<tr className='bg-gray-100'>
												<th className='border px-4 py-2'>ID</th>
												<th className='border px-4 py-2'>Usuário</th>
												<th className='border px-4 py-2'>Campo</th>
												<th className='border px-4 py-2'>Status</th>
												<th className='border px-4 py-2'>Data de Início</th>
												<th className='border px-4 py-2'>Data de Fim</th>
											</tr>
										</thead>
										<tbody>
											{reservations.map((reservation, index) => (
												<tr key={index + reservation.id + reservation.start_time + reservation.end_time}>
													<td className='border px-4 py-2'>{reservation.id}</td>
													<td className='border px-4 py-2'>{reservation.user.name}</td>
													<td className='border px-4 py-2'>{reservation.field.name}</td>
													<td className='border px-4 py-2'>{reservation.status}</td>
													<td className='border px-4 py-2'>{new Date(reservation.start_time).toLocaleString()}</td>
													<td className='border px-4 py-2'>{new Date(reservation.end_time).toLocaleString()}</td>
												</tr>
											))}
										</tbody>
									</table>

									<div className='mt-6 text-center'>
										<button
											onClick={printReservations}
											className='bg-blue-500 text-white px-6 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-blue-600'
										>
											<FaPrint />
											<span>Imprimir</span>
										</button>
									</div>
								</div>
								<div className='lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4'>
									{reservations.map((reservation, index) => (
										<div
											key={
												index + reservation.id + reservation.start_time + reservation.end_time + reservation.field.id
											}
											className='p-4 border rounded shadow-md'
										>
											<div className=''>
												<p>
													<strong>ID:</strong> {reservation.id}
												</p>
												<p>
													<strong>Usuário:</strong> {reservation.user.name}
												</p>
												<p>
													<strong>Campo:</strong> {reservation.field.name}
												</p>
												<p>
													<strong>Status:</strong> {reservation.status}
												</p>
												<p>
													<strong>Data de Início:</strong> {new Date(reservation.start_time).toLocaleString()}
												</p>
												<p>
													<strong>Data de Fim:</strong> {new Date(reservation.end_time).toLocaleString()}
												</p>
											</div>
										</div>
									))}
									<div className='mt-6 text-center'>
										<button
											onClick={printReservations}
											className='bg-blue-500 text-white px-6 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-blue-600'
										>
											<FaPrint />
											<span>Imprimir</span>
										</button>
									</div>
								</div>
							</>
						:	<div className='text-center'>Nenhuma reserva encontrada.</div>}
					</>
				}
			</div>
		</Sidebar>
	);
};

export default ReservationFilterPage;
