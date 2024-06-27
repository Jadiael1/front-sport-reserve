import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password_confirmation: '',
		cpf: '',
		phone: '',
	});
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { login, user, isLoading } = useAuth();

	useEffect(() => {
		if (user && !isLoading) {
			navigate('/');
		}
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		try {
			const response = await fetch('https://api-sport-reserve.juvhost.com/api/v1/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify(formData),
			});
			const data = await response.json();

			if (response.status === 201 && data.status === 'success') {
				await login(formData.email, formData.password);
				alert('Registro realizado com sucesso!');
				navigate('/');
			} else {
				setError(data.message || 'Falha ao registrar');
			}
		} catch (error) {
			setError('Falha ao registrar');
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-4'>Registrar</h1>
			<form onSubmit={handleRegister}>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Nome:</label>
					<input
						type='text'
						name='name'
						className='w-full p-2 border rounded'
						required
						value={formData.name}
						onChange={handleChange}
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Email:</label>
					<input
						type='email'
						name='email'
						className='w-full p-2 border rounded'
						required
						value={formData.email}
						onChange={handleChange}
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Senha:</label>
					<input
						type='password'
						name='password'
						className='w-full p-2 border rounded'
						required
						value={formData.password}
						onChange={handleChange}
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Confirme a Senha:</label>
					<input
						type='password'
						name='password_confirmation'
						className='w-full p-2 border rounded'
						required
						value={formData.password_confirmation}
						onChange={handleChange}
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>CPF:</label>
					<input
						type='text'
						name='cpf'
						className='w-full p-2 border rounded'
						required
						value={formData.cpf}
						onChange={handleChange}
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Telefone:</label>
					<input
						type='text'
						name='phone'
						className='w-full p-2 border rounded'
						required
						value={formData.phone}
						onChange={handleChange}
					/>
				</div>
				{error && <div className='text-red-500 mb-4'>{error}</div>}
				<button
					type='submit'
					className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
				>
					Registrar
				</button>
				<button
					type='button'
					className='w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300 mt-4'
					onClick={() => navigate('/signin')}
				>
					Voltar
				</button>
			</form>
		</div>
	);
};

export default RegisterPage;
