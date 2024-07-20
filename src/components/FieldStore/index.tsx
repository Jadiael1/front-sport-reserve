import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUpload, FaArrowLeft } from 'react-icons/fa';


const FieldForm = () => {
	const { token } = useAuth();
	const [name, setName] = useState('');
	const [location, setLocation] = useState('');
	const [type, setType] = useState('');
	const [hourlyRate, setHourlyRate] = useState('');
	const [images, setImages] = useState<FileList | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setMessage(null);
		setError(null);

		const formData = new FormData();
		formData.append('name', name);
		formData.append('location', location);
		formData.append('type', type);
		formData.append('hourly_rate', hourlyRate);
		if (images) {
			for (let i = 0; i < images.length; i++) {
				formData.append('images[]', images[i]);
			}
		}

		try {
			const response = await fetch(`${baseURL}/fields`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});

			const data = await response.json();

			if (response.ok) {
				setMessage('Campo criado com sucesso!');
				setTimeout(() => navigate('/'), 3000);
			} else {
				setError(data.message || 'Falha ao salvar o campo.');
			}
		} catch (error) {
			setError('Falha ao salvar o campo.');
		}
	};

	return (
		<section className='w-full bg-gray-100 min-h-screen flex justify-center items-center'>
			<div className='max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg'>
				<h1 className='text-3xl font-bold  text-center py-8'>Insira uma nova arena</h1>
				{message && <div className='text-green-500 mb-4'>{message}</div>}
				{error && <div className='text-red-500 mb-4'>{error}</div>}
				<form onSubmit={handleSubmit}>
					<div className='mb-4 relative'>
						<label
							htmlFor='name'
							className='absolute text-sm text-dark-500 bg-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1'
						>
							Nome da arena
						</label>
						<input
							id='name'
							type='text'
							className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none dark:text-dark dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							required
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
							id='location'
							type='text'
							className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none dark:text-dark dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							required
							value={location}
							onChange={e => setLocation(e.target.value)}
						/>
					</div>
					<div className='mb-4 relative'>
						<label
							htmlFor='type'
							className='absolute text-sm text-dark-500 bg-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1'
						>
							Modalidade
						</label>
						<input
							id='type'
							type='text'
							className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none dark:text-dark dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							required
							value={type}
							onChange={e => setType(e.target.value)}
						/>
					</div>
					<div className='mb-4 relative'>
						<label
							htmlFor='hourlyRate'
							className='absolute text-sm text-dark-500 bg-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1'
						>
							Valor por hora
						</label>
						<input
							id='hourlyRate'
							type='number'
							className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none dark:text-dark dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							required
							value={hourlyRate}
							onChange={e => setHourlyRate(e.target.value)}
						/>
					</div>
					<div className='mb-4 flex flex-col items-center justify-center gap-3'>
						<label
							htmlFor='file-upload'
							className='flex items-center cursor-pointer mt-3'
						>
							<div className='flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300'>
								<FaUpload className='mr-2' />
								Escolher imagens
							</div>

							<input
								id='file-upload'
								name='file-upload'
								type='file'
								className='sr-only'
								multiple
								onChange={e => setImages(e.target.files)}
							/>
						</label>

						<p className='font-bold mb-2'>
							OBS: <span className='font-normal'>Máximo 5 imagens</span>
						</p>
						{images && images.length > 0 && (
							<span className='text-gray-500 text-sm ml-2'>{images.length} imagem(ns) selecionada(s)</span>
						)}
					</div>

					<div className='flex flex-col justify-between'>
						<button
							type='submit'
							className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mt-4'
						>
							Criar arena
						</button>
						<button
							type='button'
							onClick={() => navigate('/')}
							className='flex items-center justify-center w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-400 transition duration-300 mt-4'
						>
							<FaArrowLeft className='mr-2' /> Voltar
						</button>
					</div>
				</form>
			</div>
		</section>
	);
};

export default FieldForm;
