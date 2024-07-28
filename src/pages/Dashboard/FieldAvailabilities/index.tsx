import Sidebar from '../../../components/common/Sidebar';
import { useAuth } from '../../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import { IFieldAvailability } from '../../../interfaces/IFieldAvailability';
import { IField } from '../../../interfaces/IField';
import ConfirmationModal from '../../../components/common/ConfirmationModalProps';
import { messageManager } from '../../../components/common/Message/messageInstance';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Home = () => {
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
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	useEffect(() => {
		fetchFields();
		fetchAvailabilities();
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

	const fetchAvailabilities = async () => {
		const response = await fetch(`${baseURL}/fieldAvailabilities`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		});
		const data = await response.json();
		setAvailabilities(data.data.data);
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
				setAvailabilities(prev => [...prev, data.data]);
				setNewAvailability({ field_id: '', day_of_week: 'Monday', start_time: '', end_time: '' });
				messageManager.notify({
					message: 'Disponibilidade de horario criada com sucesso.',
					type: 'success',
					duration: 3000,
				});
			}
		} catch (error) {
			console.error(error);
			messageManager.notify({
				message: 'Erro ao criar disponibilidade de horario.',
				type: 'error',
				duration: 3000,
			});
		}
	};

	const handleUpdate = async () => {
		if (!editingAvailability) return;

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
					message: 'Disponibilidade de horario editada com sucesso.',
					type: 'success',
					duration: 3000,
				});
			}
		} catch (error) {
			console.error(error);
			messageManager.notify({
				message: 'Erro ao editar disponibilidade de horario.',
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
				message: 'Disponibilidade de horario deletada com sucesso.',
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

	return (
		<Sidebar>
			<div className='p-4'>
				<h1 className='text-2xl font-bold mb-4'>Gerenciar disponibilidades de campo</h1>

				<div className='mb-4 p-4 border rounded'>
					<h2 className='text-xl mb-2'>
						{editingAvailability ? 'Editar Disponibilidade' : 'Criar nova disponibilidade'}
					</h2>
					<div className='grid grid-cols-4 gap-4 mb-4'>
						<select
							className='p-2 border rounded'
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
						<select
							className='p-2 border rounded'
							value={editingAvailability ? editingAvailability.day_of_week : newAvailability.day_of_week}
							onChange={e => handleInputChange('day_of_week', e.target.value)}
						>
							{daysOfWeek.map(day => (
								<option
									key={day}
									value={day}
								>
									{day}
								</option>
							))}
						</select>
						<input
							type='time'
							className='p-2 border rounded'
							value={editingAvailability ? editingAvailability.start_time : newAvailability.start_time}
							onChange={e => handleInputChange('start_time', e.target.value)}
						/>
						<input
							type='time'
							className='p-2 border rounded'
							value={editingAvailability ? editingAvailability.end_time : newAvailability.end_time}
							onChange={e => handleInputChange('end_time', e.target.value)}
						/>
					</div>
					<button
						onClick={editingAvailability ? handleUpdate : handleCreate}
						className='flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
					>
						<AiOutlinePlus className='mr-2' />{' '}
						{editingAvailability ? 'Atualizar Disponibilidade' : 'Criar Disponibilidade'}
					</button>
				</div>

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
									<td className='py-2 px-4 border'>{fields.find(field => field.id === availability.field_id)?.name}</td>
									<td className='py-2 px-4 border'>{availability.day_of_week}</td>
									<td className='py-2 px-4 border'>{availability.start_time}</td>
									<td className='py-2 px-4 border'>{availability.end_time}</td>
									<td className='py-2 px-4 border flex justify-around'>
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
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<ConfirmationModal
					isOpen={openConfirmationModal}
					title='Confirmar Exclusão'
					message='Tem certeza de que deseja excluir essa disponibilidade de horario?'
					onConfirm={handleDelete}
					onCancel={() => setOpenConfirmationModal(false)}
					icon={<FaTrash size={16} />}
					defaultClassName={true}
				/>
			</div>
		</Sidebar>
	);
};

export default Home;
