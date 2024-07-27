import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IField } from '../../interfaces/IField';
import { useAuth } from '../../hooks/useAuth';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import { LuImagePlus } from 'react-icons/lu';
import { messageManager } from '../../components/common/Message/messageInstance';
import ConfirmationModal from '../../components/common/ConfirmationModalProps';
import AnimateSpin from '../../assets/svg/AnimateSpin';
import goBack from '../../utils/goBack';

const FieldUpdateForm = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { token } = useAuth();
	const { id } = useParams<{ id: string }>();
	const [field, setField] = useState<IField | null>(location.state?.field || null);

	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	useEffect(() => {
		if (!field) {
			fetch(`${baseURL}/fields/${id}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
			})
				.then(resp => resp.json())
				.then(resp => {
					setField(resp.data);
				})
				.catch(console.error);
		}
	}, [baseURL, field, id, token]);

	const handleUpdateField = async () => {
		if (!field) return;
		setError(null);

		const formData = new FormData();
		formData.append('_method', 'PATCH');
		formData.append('name', field.name);
		formData.append('location', field.location);
		formData.append('type', field.type);
		formData.append('hourly_rate', field.hourly_rate as string);
		formData.append('status', field.status);

		setLoading(true);
		try {
			const response = await fetch(`${baseURL}/fields/${field?.id}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
				body: formData,
			});
			const data = await response.json();

			if (response.ok) {
				messageManager.notify({ message: 'Arena atualizada com sucesso!', type: 'success', duration: 3000 });
				navigate('/');
			} else {
				setError(data.message || 'Falha ao atualizar a arena');
			}
		} catch (error) {
			setError('Falha ao atualizar a arena');
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateImage = async (imageId: number, newImage: File) => {
		if (!field) return;
		setError(null);
		setLoading(true);
		const formData = new FormData();
		formData.append('_method', 'PATCH');
		formData.append('images[]', newImage);
		formData.append('image_ids[]', imageId.toString());

		try {
			const response = await fetch(`${baseURL}/fields/${field.id}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
				body: formData,
			});
			const data = await response.json();
			if (response.ok) {
				messageManager.notify({ message: 'Image updated successfully.', type: 'success', duration: 3000 });
				setField((prev: IField | null) => (prev ? { ...prev, images: data.data.images } : prev));
			} else {
				setLoading(false);
				setError(data.message || 'Falha ao atualizar a imagem');
			}
		} catch (error) {
			setError('Falha ao atualizar a imagem');
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const handleDeleteImage = async (imageId: number) => {
		if (!field) return;
		setIsModalOpen(false);
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append('_method', 'PATCH');
			formData.append('image_ids[]', imageId.toString());

			const response = await fetch(`${baseURL}/fields/${field.id}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
				body: formData,
			});

			if (response.ok) {
				messageManager.notify({ message: 'Imagem excluída com sucesso.', type: 'success', duration: 3000 });
				setField((prev: IField | null) =>
					prev ? { ...prev, images: prev.images.filter(image => image.id !== imageId) } : prev,
				);
			} else {
				const data = await response.json();
				console.error('Erro ao excluir imagem:', data);
				setError(data.message || 'Falha ao excluir a imagem.');
				messageManager.notify({
					message: data.message || 'Falha ao excluir a imagem.',
					type: 'error',
					duration: 3000,
				});
			}
		} catch (error) {
			console.error('Erro na requisição:', error);
			setError('Falha ao excluir a imagem.');
			messageManager.notify({
				message: 'Falha ao excluir a imagem.',
				type: 'error',
				duration: 3000,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleImageChange = (imageId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			handleUpdateImage(imageId, event.target.files[0]);
		}
	};

	const handleStoreImage = async (newImage: FileList | null) => {
		if (!field) return;
		setError(null);
		setLoading(true);
		const formData = new FormData();
		formData.append('_method', 'PATCH');
		if (newImage) {
			Array.from(newImage).forEach(image => {
				formData.append('images[]', image);
			});
		}

		try {
			const response = await fetch(`${baseURL}/fields/${field.id}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
				body: formData,
			});
			const data = await response.json();
			if (response.ok) {
				messageManager.notify({ message: 'Image updated successfully.', type: 'success', duration: 3000 });
				setField((prev: IField | null) => (prev ? { ...prev, images: data.data.images } : prev));
			} else {
				setError(data.message || 'Falha ao atualizar a imagem');
			}
		} catch (error) {
			setError('Falha ao atualizar a imagem');
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className='w-full bg-gray-100 min-h-screen flex justify-center items-center'>
			<div className='w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg'>
				<button
					className='flex items-center px-4 py-2 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out transform hover:scale-105'
					onClick={() => goBack(navigate)}
				>
					<FaArrowLeft className='mr-2' />
					Voltar
				</button>
				<h1 className='text-3xl font-bold mb-4 text-center'>Atualizar arena</h1>
				{error && <div className='text-red-500 mb-4'>{error}</div>}

				<div className='mb-4'>
					<label
						htmlFor='name'
						className='block text-sm font-medium text-gray-700'
					>
						Nome da arena
					</label>
					<input
						type='text'
						id='name'
						className={`block w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-white text-gray-900'}`}
						value={field?.name || ''}
						disabled={loading}
						onChange={e => setField(prev => prev && { ...prev, name: e.target.value })}
					/>
				</div>

				<div className='mb-4'>
					<label
						htmlFor='location'
						className='block text-sm font-medium text-gray-700'
					>
						Localização
					</label>
					<input
						type='text'
						id='location'
						className={`block w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-white text-gray-900'}`}
						value={field?.location || ''}
						disabled={loading}
						onChange={e => setField(prev => prev && { ...prev, location: e.target.value })}
					/>
				</div>

				<div className='mb-4'>
					<label
						htmlFor='type'
						className='block text-sm font-medium text-gray-700'
					>
						Modalidade
					</label>
					<input
						type='text'
						id='type'
						className={`block w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-white text-gray-900'}`}
						value={field?.type || ''}
						disabled={loading}
						onChange={e => setField(prev => prev && { ...prev, type: e.target.value })}
					/>
				</div>

				<div className='mb-4'>
					<label
						htmlFor='hourlyRate'
						className='block text-sm font-medium text-gray-700'
					>
						Valor por hora
					</label>
					<input
						type='number'
						id='hourlyRate'
						className={`block w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-white text-gray-900'}`}
						value={field?.hourly_rate || ''}
						disabled={loading}
						onChange={e => setField(prev => prev && { ...prev, hourly_rate: e.target.value })}
					/>
				</div>

				<div className='mb-4'>
					<label
						htmlFor='status'
						className='block text-sm font-medium text-gray-700'
					>
						Status
					</label>
					<select
						id='status'
						className={`block w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-white text-gray-900'}`}
						value={field?.status || 'active'}
						disabled={loading}
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
							setField(prev => prev && { ...prev, status: e.target.value as 'active' | 'inactive' })
						}
					>
						<option value='active'>Ativo</option>
						<option value='inactive'>Inativo</option>
					</select>
				</div>

				<h3 className='text-xl font-semibold mb-2 text-center'>Imagens da arena</h3>

				<div className='flex items-center justify-between p-3 flex-wrap'>
					<p className='font-bold mb-2'>
						OBS: <span className='font-normal'>Máximo 5 imagens</span>
					</p>

					<input
						type='file'
						id='file-input-new'
						className='hidden'
						disabled={loading}
						onChange={evt => handleStoreImage(evt.target.files)}
					/>
					<label
						htmlFor='file-input-new'
						className={`py-2 px-4 rounded flex items-center gap-1 ${loading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white cursor-pointer hover:bg-blue-600'} transition duration-300`}
					>
						<LuImagePlus />
						Adicionar imagem
					</label>
				</div>

				{field?.images.length === 0 ?
					<p className='text-gray-500'>Nenhuma imagem disponível</p>
				:	<div className='flex flex-wrap gap-4'>
						{field?.images.map(image => (
							<div
								key={image.id}
								className='relative flex flex-col items-center bg-gray-100 p-3 rounded-xl'
							>
								<img
									src={`${baseURL}/${image.path}`.replace('api/v1/', 'public')}
									alt={`Field ${field.name}`}
									className='w-full h-32 object-cover mb-2 rounded'
								/>
								<button
									onClick={() => !loading && setIsModalOpen(true)}
									className={`absolute top-[-5px] right-0 p-1 rounded-full transition duration-300 ${loading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'text-red-500 bg-white hover:text-white hover:bg-red-500 border border-red-500'}`}
									disabled={loading}
								>
									<FaTrash size={16} />
								</button>

								<ConfirmationModal
									isOpen={isModalOpen}
									title='Confirmar Exclusão'
									message='Tem certeza de que deseja excluir esta imagem?'
									onConfirm={() => handleDeleteImage(image.id)}
									onCancel={handleCancel}
									icon={<FaTrash size={16} />}
									defaultClassName={true}
								/>
								<input
									type='file'
									id={`file-input-${image.id}`}
									className='hidden'
									onChange={handleImageChange(image.id)}
									disabled={loading}
								/>
								<label
									htmlFor={`file-input-${image.id}`}
									className={`py-2 px-4 rounded transition duration-300 ${loading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'}`}
								>
									{loading ?
										<div className='flex items-center justify-center'>
											<AnimateSpin />
										</div>
									:	'Atualizar imagem'}
								</label>
							</div>
						))}
					</div>
				}

				<div className='flex justify-center mt-8'>
					<button
						className={`w-1/2 py-2 px-4 rounded transition duration-300 ${loading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
						onClick={handleUpdateField}
						disabled={loading}
					>
						{loading ?
							<div className='flex items-center justify-center'>
								<AnimateSpin />
							</div>
						:	'Atualizar arena'}
					</button>
				</div>
			</div>
		</section>
	);
};

export default FieldUpdateForm;
