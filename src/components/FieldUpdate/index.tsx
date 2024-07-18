import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IField } from '../Home/interfaces/IFields';
import { useAuth } from '../../contexts/AuthContext';
import { FaTrash } from 'react-icons/fa';
import { Modal, message } from 'antd';

const FieldUpdateForm = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { token } = useAuth();
	const field: IField = location.state.field;
	const [name, setName] = useState(field.name);
	const [locationField, setLocationField] = useState(field.location);
	const [type, setType] = useState(field.type);
	const [hourlyRate, setHourlyRate] = useState(field.hourly_rate);
	const [images, setImages] = useState(field.images || []);
	// const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	const handleUpdateField = async () => {
		// setMessage(null);
		setError(null);

		const formData = new FormData();
		formData.append('_method', 'PATCH');
		formData.append('name', name);
		formData.append('location', locationField);
		formData.append('type', type);
		formData.append('hourly_rate', hourlyRate.toString());

		setLoading(true);
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
				message.error('Field updated successfully.');
				navigate('/');
			} else {
				setError(data.message || 'Failed to update field.');
			}
		} catch (error) {
			setError('Failed to update field.');
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateImage = async (imageId: number, newImage: File) => {
		// setMessage(null);
		setError(null);

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
				message.success('Image updated successfully.');
				setImages(data.data.images);
			} else {
				setError(data.message || 'Falha ao atualizar a imagem');
			}
		} catch (error) {
			setError('Falha ao atualizar a imagem');
		}
	};

	const handleDeleteImage = (imageId: number) => {
		Modal.confirm({
			title: 'Confirmar Exclusão',
			content: 'Tem certeza de que deseja excluir esta imagem?',
			okText: 'Sim',
			cancelText: 'Não',
			onOk: async () => {
				setLoading(true);
				try {
					const response = await fetch(`${baseURL}/fields/${field.id}/images/${imageId}`, {
						method: 'DELETE',
						headers: {
							Authorization: `Bearer ${token}`,
							Accept: 'application/json',
						},
					});

					if (response.ok) {
						message.success('Imagem excluída com sucesso.');
						setImages(images.filter(image => image.id !== imageId));
					} else {
						const data = await response.json();
						setError(data.message || 'Falha ao excluir a imagem.');
						message.error(data.message || 'Falha ao excluir a imagem.');
					}
				} catch (error) {
					setError('Falha ao excluir a imagem.');
					message.error('Falha ao excluir a imagem.');
				} finally {
					setLoading(false);
				}
			},
		});
	};

	const handleImageChange = (imageId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			handleUpdateImage(imageId, event.target.files[0]);
		}
	};

	return (
		<section className='w-full bg-gray-100 min-h-screen flex justify-center items-center'>
			<div className='w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg'>
				<h1 className='text-3xl font-bold mb-4 text-center'>Atualizar arena</h1>
				{/* {message && <div className='text-green-500 mb-4'>{message}</div>} */}
				{error && <div className='text-red-500 mb-4'>{error}</div>}
				<div className='mb-4 relative'>
					<label
						htmlFor='name'
						className='absolute text-sm text-dark-500 bg-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1'
					>
						Nome da arena
					</label>
					<input
						type='text'
						className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none dark:text-dark dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
						value={name}
						onChange={e => setName(e.target.value)}
					/>
				</div>
				<div className='mb-4 relative'>
					<label
						htmlFor='location'
						className='absolute text-sm text-dark-500 bg-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1'
					>
						Localização
					</label>
					<input
						type='text'
						className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none dark:text-dark dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
						value={locationField}
						onChange={e => setLocationField(e.target.value)}
					/>
				</div>
				<div className='mb-4 relative'>
					<label className='absolute text-sm text-dark-500 bg-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1'>
						Modalidade
					</label>
					<input
						type='text'
						className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none dark:text-dark dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
						value={type}
						onChange={e => setType(e.target.value)}
					/>
				</div>
				<div className='mb-4 relative'>
					<label className='absolute text-sm text-dark-500 bg-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1'>
						Valor por hora
					</label>
					<input
						type='number'
						className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none dark:text-dark dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
						value={hourlyRate}
						onChange={e => setHourlyRate(parseFloat(e.target.value))}
					/>
				</div>

				<h3 className='text-xl font-semibold mb-2 text-center my-2'>Imagens da arena</h3>

				<p className='font-bold mb-2'>
					OBS: <span className='font-normal'>Máximo 5 imagens</span>
				</p>
				{images.length === 0 ?
					<p className='text-gray-500'>Nenhuma imagem dispónivel</p>
				:	<div className='flex flex-wrap gap-4'>
						{images.map(image => (
							<div
								key={image.id}
								className='relative flex flex-col items-center'
							>
								<img
									src={`${baseURL}/${image.path}`.replace('api/v1/', 'public')}
									alt={`Field ${field.name}`}
									className='w-full h-32 object-cover mb-2 rounded '
								/>
								<button
									onClick={() => handleDeleteImage(image.id)}
									className='absolute top-[-5px] right-0 text-red-500 bg-white border border-red-500 p-1 rounded-full hover:text-white hover:bg-red-500 transition duration-300'
								>
									<FaTrash size={16} />
								</button>

								<input
									type='file'
									id={`file-input-${image.id}`}
									className='hidden'
									onChange={handleImageChange(image.id)}
								/>
								<label
									htmlFor={`file-input-${image.id}`}
									className='bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-600 transition duration-300'
								>
									Atualizar imagem
								</label>
							</div>
						))}
					</div>
				}

				<button
					className='mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
					onClick={handleUpdateField}
					disabled={loading}
				>
					{loading ?
						<>
							<div className='flex items-center justify-center'>
								<svg
									aria-hidden='true'
									className=' w-8 h-8 text-white animate-spin dark:text-white fill-blue-600'
									viewBox='0 0 100 101'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
										fill='currentColor'
									/>
									<path
										d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
										fill='currentFill'
									/>
								</svg>
							</div>
						</>
					:	'Atualizar arena'}
				</button>
			</div>
		</section>
	);
};

export default FieldUpdateForm;
