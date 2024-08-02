import { useEffect, useState } from 'react';
import Sidebar from '../../../components/common/Sidebar';
import { useAuth } from '../../../hooks/useAuth';
import { IPayments } from '../../../interfaces/IPayments';
import { FaChevronLeft, FaChevronRight, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import Alert from '../../../components/common/Alert';

const Payments = () => {
	const { token } = useAuth();
	const [payments, setPayments] = useState<IPayments[] | null>(null);
	const [pagination, setPagination] = useState({
		current_page: 1,
		last_page: 1,
		per_page: 15,
		total: 0,
	});
	const [notice, setNotice] = useState<{ message: string } | null>({
		message: 'Não é possível inativar ou ativar pagamentos cujas datas de marcação inicial já passaram.',
	});
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	useEffect(() => {
		fetchPayments(pagination.current_page);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pagination.current_page]);

	const fetchPayments = async (page: number) => {
		try {
			const response = await fetch(`${baseURL}/payments?page=${page}&sort_by=created_at&sort_order=desc`, {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
			});
			const data = await response.json();
			setPayments(data.data.data);
			setPagination({
				current_page: data.data.current_page,
				last_page: data.data.last_page,
				per_page: data.data.per_page,
				total: data.data.total,
			});
		} catch (error) {
			console.error('Failed to fetch payments:', error);
		}
	};

	const handlePageChange = (newPage: number) => {
		setPagination(prev => ({ ...prev, current_page: newPage }));
	};

	const formatDate = (dateString: string | null) => {
		const date = new Date(dateString ? dateString : '');
		const formattedDate =
			dateString ?
				`${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
			:	null;
		return formattedDate;
	};

	const formatStatus = (status: string) => {
		switch (status) {
			case 'WAITING':
				return 'Aguardando';
			case 'PAID':
				return 'Pago';
			case 'CANCELED':
				return 'Cancelado';
			default:
				return 'Desconhecido';
		}
	};

	const handleToggleStatus = async (checkoutId: string) => {
		try {
			const response = await fetch(`${baseURL}/payments/checkouts/${checkoutId}/toggle`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
			});
			const data = await response.json();
			if (data.status === 'success') {
				alert('Status atualizado com sucesso.');
				fetchPayments(pagination.current_page);
			} else {
				alert('Falha ao atualizar status.');
			}
		} catch (error) {
			console.error('Error updating status:', error);
		}
	};

	const renderActionButton = (payment: IPayments) => {
		const now = new Date();
		const startTime = new Date(payment.reservation.start_time);
		const canToggle = startTime > now && (payment.status === 'WAITING' || payment.status === 'CANCELED');

		const toggleText = payment.status === 'WAITING' ? 'Inativar' : 'Ativar';
		const toggleColor = payment.status === 'WAITING' ? 'bg-red-500' : 'bg-green-500';
		const hoverColor = payment.status === 'WAITING' ? 'hover:bg-red-700' : 'hover:bg-green-700';

		return (
			<div className='flex justify-center'>
				<button
					onClick={() => handleToggleStatus(payment.checkout_id)}
					className={`w-28 ${canToggle ? toggleColor + ' ' + hoverColor : 'opacity-50 bg-gray-500 hover:bg-gray-700'} text-white px-2 py-1 rounded transition flex items-center justify-center`}
					disabled={!canToggle}
				>
					{payment.status === 'WAITING' ?
						<FaTimesCircle className='mr-1' />
					:	<FaCheckCircle className='mr-1' />}
					{toggleText}
				</button>
			</div>
		);
	};

	return (
		<Sidebar>
			{notice && (
				<Alert
					message={notice.message}
					onClose={() => setNotice(null)}
					type='info'
				/>
			)}
			<div className='p-4'>
				<h1 className='text-2xl font-bold mb-4'>Gerenciar Pagamentos</h1>

				<div className='flex justify-between items-center mt-4 mb-4'>
					<button
						disabled={pagination.current_page === 1}
						onClick={() => handlePageChange(pagination.current_page - 1)}
						className={`flex items-center px-4 py-2 rounded ${
							pagination.current_page === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-700'
						}`}
					>
						<FaChevronLeft className='mr-2' /> Anterior
					</button>
					<span>
						Página {pagination.current_page} de {pagination.last_page}
					</span>
					<button
						disabled={pagination.current_page === pagination.last_page}
						onClick={() => handlePageChange(pagination.current_page + 1)}
						className={`flex items-center px-4 py-2 rounded ${
							pagination.current_page === pagination.last_page ?
								'bg-gray-300'
							:	'bg-blue-500 text-white hover:bg-blue-700'
						}`}
					>
						Próxima <FaChevronRight className='ml-2' />
					</button>
				</div>

				<div className='hidden lg:block'>
					<div className='overflow-x-auto'>
						<table className='min-w-full bg-white border'>
							<thead>
								<tr>
									<th className='py-2 px-4 border'>Campo</th>
									<th className='py-2 px-4 border'>Quantia</th>
									<th className='py-2 px-4 border'>Status</th>
									<th className='py-2 px-4 border'>Data Pagamento</th>
									<th className='py-2 px-4 border'>Url Pagamento</th>
									<th className='py-2 px-4 border'>Ações</th>
								</tr>
							</thead>
							<tbody>
								{payments ?
									payments.map((payment, index) =>
										payment ?
											<tr key={index}>
												<td className='py-2 px-4 border'>
													<div className='flex flex-col justify-center items-center'>
														{payment.reservation.field.name}
													</div>
												</td>
												<td className='py-2 px-4 border'>
													<div className='flex flex-col justify-center items-center'>R$ {payment.amount}</div>
												</td>
												<td className='py-2 px-4 border'>
													<div className='flex flex-col justify-center items-center'>
														{formatStatus(payment.status)}
													</div>
												</td>
												<td className='py-2 px-4 border'>
													<div className='flex flex-col justify-center items-center'>
														{formatDate(payment.payment_date)}
													</div>
												</td>
												<td className='py-2 px-4 border'>
													<a
														href={payment.url}
														target='_blank'
														rel='noopener noreferrer'
														className='text-blue-500 hover:text-blue-700 underline flex flex-col justify-center items-center'
													>
														Acessar Pagamento
													</a>
												</td>

												<td className='py-2 px-4 border'>{renderActionButton(payment)}</td>
											</tr>
										:	null,
									)
								:	null}
							</tbody>
						</table>
					</div>
				</div>

				<div className='lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4'>
					{payments ?
						payments.map((payment, index) =>
							payment ?
								<div
									key={index}
									className='p-4 border rounded shadow-md'
								>
									<p>
										<strong>Campo:</strong> {payment.reservation.field.name}
									</p>
									<p>
										<strong>Quantia:</strong> R$ {payment.amount}
									</p>
									<p>
										<strong>Status:</strong> {formatStatus(payment.status)}
									</p>
									<p>
										<strong>Data Pagamento:</strong> {formatDate(payment.payment_date)}
									</p>
									<p>
										<strong>Url Pagamento:</strong>{' '}
										<a
											href={payment.url}
											target='_blank'
											rel='noopener noreferrer'
										>
											Url
										</a>
									</p>
									<div className='flex justify-around mt-4'>{renderActionButton(payment)}</div>
								</div>
							:	null,
						)
					:	null}
				</div>

				<div className='flex justify-between items-center mt-4'>
					<button
						disabled={pagination.current_page === 1}
						onClick={() => handlePageChange(pagination.current_page - 1)}
						className={`flex items-center px-4 py-2 rounded ${
							pagination.current_page === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-700'
						}`}
					>
						<FaChevronLeft className='mr-2' />
						Anterior
					</button>
					<span>
						Página {pagination.current_page} de {pagination.last_page}
					</span>
					<button
						disabled={pagination.current_page === pagination.last_page}
						onClick={() => handlePageChange(pagination.current_page + 1)}
						className={`flex items-center px-4 py-2 rounded ${
							pagination.current_page === pagination.last_page ?
								'bg-gray-300'
							:	'bg-blue-500 text-white hover:bg-blue-700'
						}`}
					>
						Próxima <FaChevronRight className='ml-2' />
					</button>
				</div>
			</div>
		</Sidebar>
	);
};

export default Payments;
