import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AccountActivationReminder = () => {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (user?.email_verified_at) {
			setMessage('Email já foi verificado! Você será redirecionado em breve.');
			setTimeout(() => navigate('/'), 3000);
		}
	}, []);

	const handleResendActivationEmail = async () => {
		setMessage(null);
		setError(null);

		try {
			const response = await fetch('https://api-sport-reserve.juvhost.com/api/v1/auth/email/resend', {
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
		<div className='container mx-auto p-4'>
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
					className='w-full p-2 border rounded'
					required
					value={email}
					disabled={user?.email_verified_at !== null}
					onChange={e => setEmail(e.target.value)}
				/>
			</div>
			<button
				disabled={user?.email_verified_at !== null}
				onClick={handleResendActivationEmail}
				className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
			>
				Reenviar email de ativação
			</button>
			{message && <div className='mt-4 text-green-500'>{message}</div>}
			{error && <div className='mt-4 text-red-500'>{error}</div>}
		</div>
	);
};

export default AccountActivationReminder;
