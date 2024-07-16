import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
		<div className='container mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-4'>{'Criar Novo Campo'}</h1>
			{message && <div className='text-green-500 mb-4'>{message}</div>}
			{error && <div className='text-red-500 mb-4'>{error}</div>}
			<form onSubmit={handleSubmit}>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Nome:</label>
					<input
						type='text'
						className='w-full p-2 border rounded'
						required
						value={name}
						onChange={e => setName(e.target.value)}
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Localização:</label>
					<input
						type='text'
						className='w-full p-2 border rounded'
						required
						value={location}
						onChange={e => setLocation(e.target.value)}
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Tipo:</label>
					<input
						type='text'
						className='w-full p-2 border rounded'
						required
						value={type}
						onChange={e => setType(e.target.value)}
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Preço por Hora:</label>
					<input
						type='number'
						className='w-full p-2 border rounded'
						required
						value={hourlyRate}
						onChange={e => setHourlyRate(e.target.value)}
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Imagens:</label>
					<input
						type='file'
						multiple
						className='w-full p-2 border rounded'
						onChange={e => setImages(e.target.files)}
					/>
				</div>
				<button
					type='submit'
					className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
				>
					{'Criar Campo'}
				</button>
			</form>
		</div>
	);
};

export default FieldForm;
