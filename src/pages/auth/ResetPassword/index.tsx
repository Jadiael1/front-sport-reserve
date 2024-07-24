import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPasswordPage = () => {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const token = queryParams.get('token');
	const email = queryParams.get('email');
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setMessage(null);
		setIsLoading(true);

		if (password !== confirmPassword) {
			setError('As senhas não coincidem.');
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch(`${baseURL}/auth/password/reset`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token, email, password, password_confirmation: confirmPassword }),
			});
			const data = await response.json();

			if (response.ok) {
				setMessage(data.message);
				navigate('/signin');
			} else {
				setError(data.message || 'Erro ao redefinir a senha. Tente novamente.');
			}
		} catch (error) {
			setError('Erro ao redefinir a senha. Tente novamente.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-4'>Redefinir Senha</h1>
			{message && <div className='text-green-500 mb-4'>{message}</div>}
			{error && <div className='text-red-500 mb-4'>{error}</div>}
			<form onSubmit={handleResetPassword}>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Nova Senha:</label>
					<input
						type='password'
						name='password'
						className='w-full p-2 border rounded'
						required
						value={password}
						onChange={e => setPassword(e.target.value)}
						disabled={isLoading}
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Confirme a Nova Senha:</label>
					<input
						type='password'
						name='confirmPassword'
						className='w-full p-2 border rounded'
						required
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
						disabled={isLoading}
					/>
				</div>
				<button
					type='submit'
					className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
					disabled={isLoading}
				>
					{isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
				</button>
				<button
					type='button'
					className='w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300 mt-4'
					onClick={() => navigate('/signin')}
					disabled={isLoading}
				>
					Voltar
				</button>
			</form>
		</div>
	);
};

export default ResetPasswordPage;
