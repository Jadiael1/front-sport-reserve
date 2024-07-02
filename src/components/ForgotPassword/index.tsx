import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	const handleForgotPassword = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setMessage(null);
		setIsLoading(true);

		try {
			const response = await fetch(`${baseURL}/auth/password/email`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});
			const data = await response.json();

			if (response.ok) {
				setMessage(data.message);
			} else {
				setError(data.message || 'Erro ao enviar o e-mail. Tente novamente.');
			}
		} catch (error) {
			setError('Erro ao enviar o e-mail. Tente novamente.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-4'>Esqueceu a Senha</h1>
			{message && <div className='text-green-500 mb-4'>{message}</div>}
			{error && <div className='text-red-500 mb-4'>{error}</div>}
			<form onSubmit={handleForgotPassword}>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Email:</label>
					<input
						type='email'
						name='email'
						className='w-full p-2 border rounded'
						required
						value={email}
						onChange={e => setEmail(e.target.value)}
						disabled={isLoading}
					/>
				</div>
				<button
					type='submit'
					className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
					disabled={isLoading}
				>
					{isLoading ? 'Enviando...' : 'Enviar E-mail de Redefinição'}
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

export default ForgotPasswordPage;
