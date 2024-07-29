import { useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import Sidebar from '../../../components/common/Sidebar';
import { useAuth } from '../../../hooks/useAuth';
import { IUser } from '../../../interfaces/IUser';
import ConfirmationModal from '../../../components/common/ConfirmationModalProps';
import { messageManager } from '../../../components/common/Message/messageInstance';

const Users = () => {
	const { token } = useAuth();
	const [users, setUsers] = useState<IUser[] | null>(null);
	const [newUser, setNewUser] = useState<Partial<IUser & { password: string; password_confirmation: string }>>({
		name: '',
		email: '',
		password: '',
		password_confirmation: '',
		cpf: '',
		phone: '',
	});
	const [editingUser, setEditingUser] = useState<IUser | null>(null);
	const [deletingUser, setDeletingUser] = useState<IUser | null>(null);
	const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	useEffect(() => {
		fetchUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchUsers = async () => {
		const response = await fetch(`${baseURL}/users`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		});
		const data = await response.json();
		setUsers(data.data.data);
	};

	const handleCreate = async () => {
		const payload = {
			name: newUser.name,
			email: newUser.email,
			password: newUser.password,
			password_confirmation: newUser.password_confirmation,
			cpf: newUser.cpf,
			phone: newUser.phone,
			is_admin: newUser.is_admin,
		};

		try {
			const response = await fetch(`${baseURL}/users`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				const data = await response.json();
				setUsers(prev => (prev ? [data.data, ...prev] : prev));
				setNewUser({
					name: '',
					email: '',
					password: '',
					password_confirmation: '',
					cpf: '',
					phone: '',
				});
				messageManager.notify({
					message: 'Usuário criado com sucesso.',
					type: 'success',
					duration: 3000,
				});
			}
		} catch (error) {
			console.error(error);
			messageManager.notify({
				message: 'Erro ao criar usuário.',
				type: 'error',
				duration: 3000,
			});
		}
	};

	const handleUpdate = async () => {
		if (!editingUser) return;

		const originalUser = users?.find(user => user.id === editingUser.id);
		if (!originalUser) return;

		const payload: Record<string, unknown> = {};

		(Object.keys(editingUser) as (keyof IUser)[]).forEach(key => {
			if (editingUser[key] !== undefined && editingUser[key] !== originalUser[key]) {
				payload[key] = editingUser[key];
			}
		});

		try {
			const response = await fetch(`${baseURL}/users/${editingUser.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				const data = await response.json();
				setUsers(prev => (prev ? prev.map(user => (user.id === data.data.id ? data.data : user)) : prev));
				setEditingUser(null);
				messageManager.notify({
					message: 'Usuário atualizado com sucesso.',
					type: 'success',
					duration: 3000,
				});
			}
		} catch (error) {
			console.error(error);
			messageManager.notify({
				message: 'Erro ao atualizar usuário.',
				type: 'error',
				duration: 3000,
			});
		}
	};

	const handleDelete = async () => {
		setOpenConfirmationModal(false);
		if (!deletingUser) return;

		const response = await fetch(`${baseURL}/users/${deletingUser.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		});

		if (response.ok) {
			setUsers(prev => (prev ? prev.filter(user => user.id !== deletingUser.id) : prev));
			messageManager.notify({
				message: 'Usuário deletado com sucesso.',
				type: 'success',
				duration: 3000,
			});
		}
	};

	const handleEditClick = (user: IUser) => {
		setEditingUser(user);
	};

	const handleInputChange = (field: keyof IUser | 'password' | 'password_confirmation', value: string | boolean) => {
		if (editingUser) {
			setEditingUser({ ...editingUser, [field]: value });
		} else {
			setNewUser({ ...newUser, [field]: value });
		}
	};

	const handleCancelEdit = () => {
		setEditingUser(null);
		setNewUser({
			name: '',
			email: '',
			password: '',
			password_confirmation: '',
			cpf: '',
			phone: '',
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (editingUser) {
			handleUpdate();
		} else {
			handleCreate();
		}
	};

	return (
		<Sidebar>
			<div className='p-4'>
				<h1 className='text-2xl font-bold mb-4'>Gerenciar Usuários</h1>

				<form
					className='mb-4 p-4 border rounded'
					onSubmit={handleSubmit}
				>
					<h2 className='text-xl mb-2'>{editingUser ? 'Editar Usuário' : 'Criar novo usuário'}</h2>
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-4'>
						<div className='w-full'>
							<label className='block text-sm font-medium text-gray-700'>Nome</label>
							<input
								type='text'
								className='p-2 border rounded w-full'
								value={editingUser ? editingUser.name : newUser.name}
								onChange={e => handleInputChange('name', e.target.value)}
							/>
						</div>
						<div className='w-full'>
							<label className='block text-sm font-medium text-gray-700'>Email</label>
							<input
								type='email'
								className='p-2 border rounded w-full'
								autoComplete='username email'
								value={editingUser ? editingUser.email : newUser.email}
								onChange={e => handleInputChange('email', e.target.value)}
								readOnly={!!editingUser}
								disabled={!!editingUser}
							/>
						</div>
						<div className={`w-full ${editingUser ? 'hidden' : ''}`}>
							<label className='block text-sm font-medium text-gray-700'>Senha</label>
							<input
								type='password'
								className='p-2 border rounded w-full'
								autoComplete='new-password'
								value={newUser.password}
								onChange={e => handleInputChange('password', e.target.value)}
							/>
						</div>
						<div className={`w-full ${editingUser ? 'hidden' : ''}`}>
							<label className='block text-sm font-medium text-gray-700'>Confirmação de Senha</label>
							<input
								type='password'
								className='p-2 border rounded w-full'
								autoComplete='new-password'
								value={newUser.password_confirmation}
								onChange={e => handleInputChange('password_confirmation', e.target.value)}
							/>
						</div>
						<div className='w-full'>
							<label className='block text-sm font-medium text-gray-700'>CPF</label>
							<input
								type='text'
								className='p-2 border rounded w-full'
								value={editingUser ? editingUser.cpf : newUser.cpf}
								onChange={e => handleInputChange('cpf', e.target.value)}
							/>
						</div>
						<div className='w-full'>
							<label className='block text-sm font-medium text-gray-700'>Telefone</label>
							<input
								type='text'
								className='p-2 border rounded w-full'
								value={editingUser ? editingUser.phone : newUser.phone}
								onChange={e => handleInputChange('phone', e.target.value)}
							/>
						</div>
						<div className='w-full'>
							<label className='block text-sm font-medium text-gray-700'>Admin</label>
							<select
								className='p-2 border rounded w-full'
								value={editingUser ? editingUser.is_admin.toString() : newUser.is_admin?.toString()}
								onChange={e => handleInputChange('is_admin', e.target.value)}
							>
								<option value='0'>Usuário</option>
								<option value='1'>Administrador</option>
							</select>
						</div>
					</div>
					<div className='flex justify-between'>
						<button
							type='submit'
							className='flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
						>
							<AiOutlinePlus className='mr-2' />
							{editingUser ? 'Atualizar Usuário' : 'Criar Usuário'}
						</button>
						{editingUser && (
							<button
								type='button'
								onClick={handleCancelEdit}
								className='flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700'
							>
								<FaTimes className='mr-2' /> Cancelar
							</button>
						)}
					</div>
				</form>

				<div className='hidden lg:block'>
					<div className='overflow-x-auto'>
						<table className='min-w-full bg-white border'>
							<thead>
								<tr>
									<th className='py-2 px-4 border'>Nome</th>
									<th className='py-2 px-4 border'>Email</th>
									<th className='py-2 px-4 border'>CPF</th>
									<th className='py-2 px-4 border'>Telefone</th>
									<th className='py-2 px-4 border'>Admin</th>
									<th className='py-2 px-4 border'>Ações</th>
								</tr>
							</thead>
							<tbody>
								{users ?
									users.map(user =>
										user ?
											<tr key={user.id}>
												<td className='py-2 px-4 border'>{user.name}</td>
												<td className='py-2 px-4 border'>{user.email}</td>
												<td className='py-2 px-4 border'>{user.cpf}</td>
												<td className='py-2 px-4 border'>{user.phone}</td>
												<td className='py-2 px-4 border'>{user.is_admin ? 'Sim' : 'Não'}</td>
												<td className='py-2 px-4 border'>
													<div className='flex items-center justify-center h-full space-x-2'>
														<button
															className='text-red-500 hover:text-red-700'
															onClick={() => {
																setDeletingUser(user);
																setOpenConfirmationModal(true);
															}}
														>
															<FaTrash />
														</button>
														<button
															className='text-blue-500 hover:text-blue-700'
															onClick={() => handleEditClick(user)}
														>
															<FaEdit />
														</button>
													</div>
												</td>
											</tr>
										:	null,
									)
								:	null}
							</tbody>
						</table>
					</div>
				</div>

				<div className='lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4'>
					{users ?
						users.map(user =>
							user ?
								<div
									key={user?.id}
									className='p-4 border rounded shadow-md'
								>
									<h3 className='text-lg font-semibold'>{user.name}</h3>
									<p>{user.email}</p>
									<p>{user.cpf}</p>
									<p>{user.phone}</p>
									<p>{user.is_admin ? 'Administrador' : 'Usuário'}</p>
									<div className='flex justify-around mt-4'>
										<button
											className='text-red-500 hover:text-red-700'
											onClick={() => {
												setDeletingUser(user);
												setOpenConfirmationModal(true);
											}}
										>
											<FaTrash />
										</button>
										<button
											className='text-blue-500 hover:text-blue-700'
											onClick={() => handleEditClick(user)}
										>
											<FaEdit />
										</button>
									</div>
								</div>
							:	null,
						)
					:	null}
				</div>

				<ConfirmationModal
					isOpen={openConfirmationModal}
					title='Confirmar Exclusão'
					message='Tem certeza de que deseja excluir este usuário?'
					onConfirm={handleDelete}
					onCancel={() => setOpenConfirmationModal(false)}
					icon={<FaTrash size={16} />}
					defaultClassName={true}
				/>
			</div>
		</Sidebar>
	);
};

export default Users;
