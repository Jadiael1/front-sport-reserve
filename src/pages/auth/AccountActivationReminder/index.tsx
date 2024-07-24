import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AccountActivationReminder: React.FC = () => {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const { user } = useAuth();
	const navigate = useNavigate();
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	useEffect(() => {
		if (user?.email_verified_at) {
			setMessage('Email já foi verificado! Você será redirecionado em breve.');
			setTimeout(() => navigate('/'), 3000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleResendActivationEmail = async () => {
		setMessage(null);
		setError(null);

		try {
			const response = await fetch(`${baseURL}/auth/email/resend`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({ email }),
			});
			const data = await response.json();

			if (response.status === 200 && data.status === 'success') {
				setMessage('Um novo link de ativação foi enviado para seu email.');
			} else {
				setError(data.message || 'Falha ao enviar o link de ativação.');
			}
		} catch (error) {
			setError('Falha ao enviar o link de ativação.');
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full'>
				<button
					className='flex items-center mb-4 text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out'
					onClick={() => navigate('/')}
				>
					<FaArrowLeft className='mr-2' />
					Voltar
				</button>
				<h1 className='text-3xl font-bold mb-4'>Ative sua conta</h1>
				<p className='text-lg text-gray-600 mb-4'>
					Por favor, verifique seu email para encontrar o link de ativação da conta. Se você ainda não recebeu o email,
					insira seu email abaixo e clique no botão para solicitar um novo link.
				</p>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Email:</label>
					<input
						type='email'
						name='email'
						className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
						required
						value={email}
						disabled={user?.email_verified_at !== null}
						onChange={e => setEmail(e.target.value)}
					/>
				</div>
				<button
					disabled={user?.email_verified_at !== null}
					onClick={handleResendActivationEmail}
					className='w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-gray-400'
				>
					Reenviar email de ativação
				</button>
				{message && (
					<div className='mt-4 flex items-center justify-center text-green-500'>
						<FaCheckCircle className='mr-2' />
						{message}
					</div>
				)}
				{error && (
					<div className='mt-4 flex items-center justify-center text-red-500'>
						<FaTimesCircle className='mr-2' />
						{error}
					</div>
				)}
			</div>
		</div>
	);
};

export default AccountActivationReminder;
