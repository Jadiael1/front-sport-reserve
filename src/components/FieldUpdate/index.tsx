import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IField } from '../Home/interfaces/IFields';
import { useAuth } from '../../contexts/AuthContext';

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
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	const handleUpdateField = async () => {
		setMessage(null);
		setError(null);

		const formData = new FormData();
		formData.append('_method', 'PATCH');
		formData.append('name', name);
		formData.append('location', locationField);
		formData.append('type', type);
		formData.append('hourly_rate', hourlyRate.toString());

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
				setMessage('Field updated successfully.');
				navigate('/');
			} else {
				setError(data.message || 'Failed to update field.');
			}
		} catch (error) {
			setError('Failed to update field.');
		}
	};

	const handleUpdateImage = async (imageId: number, newImage: File) => {
		setMessage(null);
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
				setMessage('Image updated successfully.');
				setImages(data.data.images);
			} else {
				setError(data.message || 'Failed to update image.');
			}
		} catch (error) {
			setError('Failed to update image.');
		}
	};

	const handleImageChange = (imageId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			handleUpdateImage(imageId, event.target.files[0]);
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-4'>Update Field</h1>
			{message && <div className='text-green-500 mb-4'>{message}</div>}
			{error && <div className='text-red-500 mb-4'>{error}</div>}
			<div className='mb-4'>
				<label className='block text-gray-700 mb-2'>Name:</label>
				<input
					type='text'
					className='w-full p-2 border rounded'
					value={name}
					onChange={e => setName(e.target.value)}
				/>
			</div>
			<div className='mb-4'>
				<label className='block text-gray-700 mb-2'>Location:</label>
				<input
					type='text'
					className='w-full p-2 border rounded'
					value={locationField}
					onChange={e => setLocationField(e.target.value)}
				/>
			</div>
			<div className='mb-4'>
				<label className='block text-gray-700 mb-2'>Type:</label>
				<input
					type='text'
					className='w-full p-2 border rounded'
					value={type}
					onChange={e => setType(e.target.value)}
				/>
			</div>
			<div className='mb-4'>
				<label className='block text-gray-700 mb-2'>Hourly Rate:</label>
				<input
					type='number'
					className='w-full p-2 border rounded'
					value={hourlyRate}
					onChange={e => setHourlyRate(parseFloat(e.target.value))}
				/>
			</div>
			<h3 className='text-xl font-semibold mb-2'>Images:</h3>
			<div className='flex flex-wrap gap-4'>
				{images.map(image => (
					<div
						key={image.id}
						className='flex flex-col items-center'
					>
						<img
							src={`${baseURL}/${image.path}`.replace('api/v1/', 'public/storage/')}
							alt={`Field ${field.name}`}
							className='w-32 h-32 object-cover mb-2 rounded'
						/>
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
							Update Image
						</label>
					</div>
				))}
			</div>
			<button
				className='mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
				onClick={handleUpdateField}
			>
				Update Field
			</button>
		</div>
	);
};

export default FieldUpdateForm;
