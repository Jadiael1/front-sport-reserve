import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';

const EmailVerification = () => {
	const [searchParams] = useSearchParams();
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	const { user } = useAuth();

	useEffect(() => {
		const id = searchParams.get('id');
		const expires = searchParams.get('expires');
		const signature = searchParams.get('signature');

		if (id && expires && signature) {
			verifyEmail(id, expires, signature);
		} else {
			setError('Parâmetros de verificação inválidos.');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const verifyEmail = async (id: string, expires: string, signature: string) => {
		if (user?.email_verified_at) {
			setMessage('Email verificado com sucesso! Você será redirecionado em breve.');
			setTimeout(() => navigate('/'), 3000);
		} else {
			try {
				const response = await fetch(`${baseURL}/auth/email/verify/${id}?expires=${expires}&signature=${signature}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
				});
				const data = await response.json();

				if (response.status === 200 && data.status === 'success') {
					setMessage('Email verificado com sucesso! Você será redirecionado em breve.');
					// fazendo location para que a aplicação faça um novo loadUser e atualize o campo email_verified_at do usuario.
					setTimeout(() => window.location.replace('/'), 3000);
				} else {
					setError(data.message || 'Falha ao verificar o email.');
				}
			} catch (error) {
				setError('Falha ao verificar o email.');
			}
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-4'>Verificação de Email</h1>
			{message && <div className='text-green-500'>{message}</div>}
			{error && <div className='text-red-500'>{error}</div>}
		</div>
	);
};

export default EmailVerification;
