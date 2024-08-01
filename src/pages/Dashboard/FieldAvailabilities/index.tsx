import Sidebar from '../../../components/common/Sidebar';
import { useAuth } from '../../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import { IFieldAvailability } from '../../../interfaces/IFieldAvailability';
import { IField } from '../../../interfaces/IField';
import ConfirmationModal from '../../../components/common/ConfirmationModalProps';
import { messageManager } from '../../../components/common/Message/messageInstance';
import translateDaysOfTheWeek from '../../../utils/translateDaysOfTheWeek';

type Tdays = {
	Monday: string;
	Tuesday: string;
	Wednesday: string;
	Thursday: string;
	Friday: string;
	Saturday: string;
	Sunday: string;
};

const daysOfWeek: (keyof Tdays)[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const FieldAvailabilities = () => {
	const { token } = useAuth();
	const [availabilities, setAvailabilities] = useState<IFieldAvailability[]>([]);
	const [fields, setFields] = useState<IField[]>([]);
	const [newAvailability, setNewAvailability] = useState({
		field_id: '',
		day_of_week: 'Monday',
		start_time: '',
		end_time: '',
	});
	const [editingAvailability, setEditingAvailability] = useState<IFieldAvailability | null>(null);
	const [deletingAvailability, setdeletingAvailability] = useState<IFieldAvailability | null>(null);
	const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
	const [pagination, setPagination] = useState({
		current_page: 1,
		last_page: 1,
		per_page: 15,
		total: 0,
	});
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	useEffect(() => {
		fetchFields();
		fetchAvailabilities(1, 'created_at', 'desc');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchFields = async () => {
		const response = await fetch(`${baseURL}/fields`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();
		setFields(data.data.data);
	};

	const fetchAvailabilities = async (page: number, sortBy = 'created_at', sortOrder = 'desc') => {
		const response = await fetch(
			`${baseURL}/fieldAvailabilities?page=${page}&sort_by=${sortBy}&sort_order=${sortOrder}`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
			},
		);
		const data = await response.json();
		setAvailabilities(data.data.data);
		setPagination({
			current_page: data.data.current_page,
			last_page: data.data.last_page,
			per_page: data.data.per_page,
			total: data.data.total,
		});
	};

	const handleCreate = async () => {
		try {
			const response = await fetch(`${baseURL}/fieldAvailabilities/${newAvailability.field_id}/availabilities`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
				body: JSON.stringify(newAvailability),
			});

			if (response.ok) {
				const data = await response.json();
				setAvailabilities(prev => [data.data, ...prev]); // Adicionando ao início
				setNewAvailability({ field_id: '', day_of_week: 'Monday', start_time: '', end_time: '' });
				messageManager.notify({
					message: 'Disponibilidade de horário criada com sucesso.',
					type: 'success',
					duration: 3000,
				});
			}
		} catch (error) {
			console.error(error);
			messageManager.notify({
				message: 'Erro ao criar disponibilidade de horário.',
				type: 'error',
				duration: 3000,
			});
		}
	};

	const handleUpdate = async () => {
		if (!editingAvailability) return;

		setEditingAvailability(prev => {
			if (!prev) return null;
			return {
				...prev,
				start_time: prev.start_time.substring(0, 5),
				end_time: prev.end_time.substring(0, 5),
			};
		});

		try {
			const response = await fetch(
				`${baseURL}/fieldAvailabilities/${editingAvailability.field_id}/availabilities/${editingAvailability.id}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
						Accept: 'application/json',
					},
					body: JSON.stringify(editingAvailability),
				},
			);

			if (response.ok) {
				const data = await response.json();
				setAvailabilities(prev => prev.map(avail => (avail.id === data.data.id ? data.data : avail)));
				setEditingAvailability(null);
				messageManager.notify({
					message: 'Disponibilidade de horário editada com sucesso.',
					type: 'success',
					duration: 3000,
				});
			}
		} catch (error) {
			console.error(error);
			messageManager.notify({
				message: 'Erro ao editar disponibilidade de horário.',
				type: 'error',
				duration: 3000,
			});
		}
	};

	const handleDelete = async () => {
		setOpenConfirmationModal(false);
		if (!deletingAvailability) return;
		const response = await fetch(
			`${baseURL}/fieldAvailabilities/${deletingAvailability.field_id}/availabilities/${deletingAvailability.id}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
			},
		);

		if (response.ok) {
			setAvailabilities(prev => prev.filter(avai => avai.id !== deletingAvailability.id));
			messageManager.notify({
				message: 'Disponibilidade de horário deletada com sucesso.',
				type: 'success',
				duration: 3000,
			});
		}
	};

	const handleEditClick = (availability: IFieldAvailability) => {
		setEditingAvailability(availability);
	};

	const handleInputChange = (field: keyof IFieldAvailability, value: string) => {
		if (editingAvailability) {
			setEditingAvailability({ ...editingAvailability, [field]: value });
		} else {
			setNewAvailability({ ...newAvailability, [field]: value });
		}
	};

	const handlePageChange = (newPage: number) => {
		fetchAvailabilities(newPage, 'created_at', 'desc');
	};

	const handleCancelEdit = () => {
		setEditingAvailability(null);
		setNewAvailability({ field_id: '', day_of_week: 'Monday', start_time: '', end_time: '' });
	};

	return (
		<Sidebar>
			<div className='p-4'>
				<h1 className='text-2xl font-bold mb-4'>Gerenciar disponibilidades de campo</h1>

				<div className='mb-4 p-4 border rounded'>
					<h2 className='text-xl mb-2'>
						{editingAvailability ? 'Editar Disponibilidade' : 'Criar nova disponibilidade'}
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-4'>
						<div className='w-full'>
							<label className='block text-sm font-medium text-gray-700'>Campo</label>
							<select
								className='p-2 border rounded w-full'
								value={editingAvailability ? editingAvailability.field_id : newAvailability.field_id}
								onChange={e => handleInputChange('field_id', e.target.value)}
							>
								<option value=''>Selecione o campo</option>
								{fields.map(field => (
									<option
										key={field.id}
										value={field.id}
									>
										{field.name}
									</option>
								))}
							</select>
						</div>
						<div className='w-full'>
							<label className='block text-sm font-medium text-gray-700'>Dia</label>
							<select
								className='p-2 border rounded w-full'
								value={editingAvailability ? editingAvailability.day_of_week : newAvailability.day_of_week}
								onChange={e => handleInputChange('day_of_week', e.target.value)}
							>
								{daysOfWeek.map(day => (
									<option
										key={day}
										value={day}
									>
										{translateDaysOfTheWeek(day)}
									</option>
								))}
							</select>
						</div>
						<div className='w-full'>
							<label className='block text-sm font-medium text-gray-700'>Hora de Início</label>
							<input
								type='time'
								className='p-2 border rounded w-full'
								value={editingAvailability ? editingAvailability.start_time : newAvailability.start_time}
								onChange={e => handleInputChange('start_time', e.target.value)}
							/>
						</div>
						<div className='w-full'>
							<label className='block text-sm font-medium text-gray-700'>Hora Final</label>
							<input
								type='time'
								className='p-2 border rounded w-full'
								value={editingAvailability ? editingAvailability.end_time : newAvailability.end_time}
								onChange={e => handleInputChange('end_time', e.target.value)}
							/>
						</div>
					</div>
					<div className='flex justify-between'>
						<button
							onClick={editingAvailability ? handleUpdate : handleCreate}
							className='flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
						>
							<AiOutlinePlus className='mr-2' />{' '}
							{editingAvailability ? 'Atualizar Disponibilidade' : 'Criar Disponibilidade'}
						</button>
						{editingAvailability && (
							<button
								onClick={handleCancelEdit}
								className='flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700'
							>
								<FaTimes className='mr-2' /> Cancelar
							</button>
						)}
					</div>
				</div>
				<div className='flex justify-between items-center mt-4 mb-4'>
					<button
						disabled={pagination.current_page === 1}
						onClick={() => handlePageChange(pagination.current_page - 1)}
						className={`px-4 py-2 rounded ${pagination.current_page === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
					>
						Anterior
					</button>
					<span>
						Página {pagination.current_page} de {pagination.last_page}
					</span>
					<button
						disabled={pagination.current_page === pagination.last_page}
						onClick={() => handlePageChange(pagination.current_page + 1)}
						className={`px-4 py-2 rounded ${pagination.current_page === pagination.last_page ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
					>
						Próxima
					</button>
				</div>
				{/* Tabela para telas maiores */}
				<div className='hidden lg:block'>
					<div className='overflow-x-auto'>
						<table className='min-w-full bg-white border'>
							<thead>
								<tr>
									<th className='py-2 px-4 border'>Campo</th>
									<th className='py-2 px-4 border'>Dia</th>
									<th className='py-2 px-4 border'>Hora de Início</th>
									<th className='py-2 px-4 border'>Hora Final</th>
									<th className='py-2 px-4 border'>Ações</th>
								</tr>
							</thead>
							<tbody>
								{availabilities.map(availability => (
									<tr key={availability.id}>
										<td className='py-2 px-4 border'>
											{fields.find(field => field.id === availability.field_id)?.name}
										</td>
										<td className='py-2 px-4 border'>{translateDaysOfTheWeek(availability.day_of_week)}</td>
										<td className='py-2 px-4 border'>{availability.start_time}</td>
										<td className='py-2 px-4 border'>{availability.end_time}</td>
										<td className='py-2 px-4 border'>
											<div className='flex items-center justify-center h-full space-x-2'>
												<button
													className='text-red-500 hover:text-red-700'
													onClick={() => {
														setdeletingAvailability(availability);
														setOpenConfirmationModal(true);
													}}
												>
													<FaTrash />
												</button>
												<button
													className='text-blue-500 hover:text-blue-700'
													onClick={() => handleEditClick(availability)}
												>
													<FaEdit />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Cards para telas menores */}
				<div className='lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4'>
					{availabilities.map(availability => (
						<div
							key={availability.id}
							className='p-4 border rounded shadow-md'
						>
							<h3 className='text-lg font-semibold'>
								{fields.find(field => field.id === availability.field_id)?.name}
							</h3>
							<p>{translateDaysOfTheWeek(availability.day_of_week)}</p>
							<p>
								{availability.start_time} - {availability.end_time}
							</p>
							<div className='flex justify-around mt-4'>
								<button
									className='text-red-500 hover:text-red-700'
									onClick={() => {
										setdeletingAvailability(availability);
										setOpenConfirmationModal(true);
									}}
								>
									<FaTrash />
								</button>
								<button
									className='text-blue-500 hover:text-blue-700'
									onClick={() => handleEditClick(availability)}
								>
									<FaEdit />
								</button>
							</div>
						</div>
					))}
				</div>

				<div className='flex justify-between items-center mt-4'>
					<button
						disabled={pagination.current_page === 1}
						onClick={() => handlePageChange(pagination.current_page - 1)}
						className={`px-4 py-2 rounded ${pagination.current_page === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
					>
						Anterior
					</button>
					<span>
						Página {pagination.current_page} de {pagination.last_page}
					</span>
					<button
						disabled={pagination.current_page === pagination.last_page}
						onClick={() => handlePageChange(pagination.current_page + 1)}
						className={`px-4 py-2 rounded ${pagination.current_page === pagination.last_page ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
					>
						Próxima
					</button>
				</div>

				<ConfirmationModal
					isOpen={openConfirmationModal}
					title='Confirmar Exclusão'
					message='Tem certeza de que deseja excluir essa disponibilidade de horário?'
					onConfirm={handleDelete}
					onCancel={() => setOpenConfirmationModal(false)}
					icon={<FaTrash size={16} />}
					defaultClassName={true}
				/>
			</div>
		</Sidebar>
	);
};

export default FieldAvailabilities;
