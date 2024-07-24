import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const EmailVerification: React.FC = () => {
	const timeRedirect = 4;
	const [searchParams] = useSearchParams();
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [timeLeft, setTimeLeft] = useState<number>(timeRedirect);
	const navigate = useNavigate();
	const baseURL = import.meta.env.VITE_API_BASE_URL;

	const { user } = useAuth();

	useEffect(() => {
		const timerId = setInterval(() => {
			setTimeLeft(prevTime => prevTime - 1);
		}, 1000);

		if (timeLeft <= 0) {
			clearInterval(timerId);
			return;
		}
		return () => clearInterval(timerId);
	}, [timeLeft]);

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
			setTimeout(() => navigate('/'), timeRedirect * 1000);
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
					setTimeout(() => window.location.replace('/'), timeRedirect * 1000);
				} else {
					setError(data.message || 'Falha ao verificar o email.');
				}
			} catch (error) {
				setError('Falha ao verificar o email.');
			}
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full'>
				<h1 className='text-3xl font-bold mb-4'>Verificação de Email</h1>
				{message && (
					<div className='flex items-center justify-center space-x-2 text-green-500 mb-4 animate-pulse'>
						<FaCheckCircle size={24} />
						<span>
							{message} {timeLeft} s
						</span>
					</div>
				)}
				{error && (
					<div className='flex items-center justify-center space-x-2 text-red-500 mb-4'>
						<FaTimesCircle size={24} />
						<span>{error}</span>
					</div>
				)}
				{!message && !error && (
					<div className='flex items-center justify-center space-x-2 text-yellow-500 mb-4'>
						<FaHourglassHalf size={24} />
						<span>Verificando...</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default EmailVerification;
