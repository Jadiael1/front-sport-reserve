import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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
				setTimeout(() => navigate('/auth/signin'), 3000);
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
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full'>
				<button
					className='flex items-center px-4 py-2 bg-trasparent text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105'
					onClick={() => navigate('/')}
				>
					<FaArrowLeft className='mr-2' />
					Voltar
				</button>
				<h1 className='text-3xl font-bold mb-6'>Redefinir Senha</h1>
				{message && (
					<div className='flex items-center justify-center text-green-500 mb-4'>
						<FaCheckCircle className='mr-2' />
						{message}
					</div>
				)}
				{error && (
					<div className='flex items-center justify-center text-red-500 mb-4'>
						<FaTimesCircle className='mr-2' />
						{error}
					</div>
				)}
				<form
					onSubmit={handleResetPassword}
					className='space-y-4'
				>
					<div>
						<label
							className='block text-gray-700 mb-2'
							htmlFor='password'
						>
							Nova Senha:
						</label>
						<input
							id='password'
							type='password'
							className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
							required
							value={password}
							onChange={e => setPassword(e.target.value)}
							disabled={isLoading}
							aria-required='true'
							autoComplete='new-password'
						/>
					</div>
					<div>
						<label
							className='block text-gray-700 mb-2'
							htmlFor='confirmPassword'
						>
							Confirme a Nova Senha:
						</label>
						<input
							id='confirmPassword'
							type='password'
							className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
							required
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}
							disabled={isLoading}
							aria-required='true'
							autoComplete='new-password'
						/>
					</div>
					<button
						type='submit'
						className='w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-gray-400'
						disabled={isLoading}
						aria-busy={isLoading}
					>
						{isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ResetPasswordPage;
