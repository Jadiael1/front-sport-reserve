import React, { useState } from 'react';
import { FaEdit, FaEnvelope, FaIdCard, FaPhone, FaSave, FaTimes } from 'react-icons/fa';
import Navbar from '../../components/common/NavBar/NavBar';
import { useAuth } from '../../hooks/useAuth';
import { IUser } from '../../interfaces/IUser';
import ProfilePhoto from '../../assets/img/user-profile-transparent.png';
import EditInputField from './EditInputField';
import InfoItem from './InfoItem';
import { messageManager } from '../../components/common/Message/messageInstance';
import { formatCPF } from '../../utils/formatCPF';
import { formatPhone } from '../../utils/formatPhone';

const Profile = () => {
	const { user, token } = useAuth();
	const [userData, setUserData] = useState<IUser | null>(user as IUser);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setUserData(prevData => (prevData ? { ...prevData, [name]: value } : null));
	};

	const handleUpdate = async () => {
		if (!userData) return;
		setLoading(true);
		try {
			const response = await fetch(`${baseURL}/users/${userData.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
				body: JSON.stringify({ phone: userData.phone }),
			});
			if (response.ok) {
				messageManager.notify({ message: 'Perfil atualizado com sucesso!', type: 'success', duration: 3000 });
				const updatedUser = await response.json();
				setUserData(updatedUser.data);
				setIsEditing(false);
			} else {
				messageManager.notify({ message: 'Falha ao atualizar os dados do usuário.', type: 'error', duration: 3000 });
			}
		} catch (err) {
			messageManager.notify({ message: 'Ocorreu um erro.', type: 'error', duration: 3000 });
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Navbar />
			<div className='mx-auto p-4 bg-background'>
				{!isEditing ?
					<div className='bg-white shadow-md rounded-lg p-8'>
						<div className='text-center mb-6'>
							<img
								className='mx-auto w-24 h-24 rounded-full border-4 border-gray-300'
								src={ProfilePhoto}
								alt='ProfilePhoto'
							/>
							<h1 className='text-2xl font-semibold my-2'>{userData?.name}</h1>
							<p className='text-gray-600'>@{userData?.name}</p>
						</div>
						<div className='border-t-2 border-gray-200 my-4'></div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<InfoItem
								icon={FaEnvelope}
								label='Email'
								value={userData?.email}
							/>
							<InfoItem
								icon={FaPhone}
								label='Telefone'
								value={formatPhone(userData?.phone as string)}
							/>
							<InfoItem
								icon={FaIdCard}
								label='CPF'
								value={formatCPF(userData?.cpf as string)}
							/>
						</div>
						<button
							onClick={() => setIsEditing(true)}
							className='mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center w-full transition duration-300'
						>
							<FaEdit className='mr-2' />
							Editar Perfil
						</button>
					</div>
				:	<form className='bg-white shadow-md rounded-lg p-8'>
						<EditInputField
							icon={FaPhone}
							label='Phone'
							name='phone'
							value={userData?.phone}
							placeholder='Digite seu telefone'
							autocomplete='phone'
							handleInputChange={handleInputChange}
						/>
						<div className='flex items-center justify-between mt-6'>
							<button
								type='button'
								onClick={handleUpdate}
								disabled={loading}
								className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition duration-300'
							>
								{loading ?
									'Saving...'
								:	<>
										<FaSave className='mr-2' />
										Salvar
									</>
								}
							</button>
							<button
								type='button'
								onClick={() => setIsEditing(false)}
								disabled={loading}
								className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition duration-300'
							>
								<FaTimes className='mr-2' />
								Cancelar
							</button>
						</div>
					</form>
				}
			</div>
		</>
	);
};

export default Profile;
