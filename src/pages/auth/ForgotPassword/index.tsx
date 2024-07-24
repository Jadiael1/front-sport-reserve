import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
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
		<section className='flex flex-col items-center justify-center w-full min-h-screen bg-slate-200'>
			<div className='container mx-auto p-6 max-w-lg h-[300px] bg-white border rounded-xl'>
				<button
					className='flex items-center px-4 py-2 bg-trasparent text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105'
					onClick={() => navigate(-1)}
				>
					<FaArrowLeft className='mr-2' />
					Voltar
				</button>
				<h1 className='text-3xl font-bold mb-4 text-center text-blue-700'>Redefina sua senha</h1>
				{message && <div className='text-green-500 mb-4 text-center'>{message}</div>}
				{error && <div className='text-red-500 mb-4'>{error}</div>}
				<form onSubmit={handleForgotPassword}>
					<div className='relative mb-4 w-3/4 mx-auto'>
						<input
							type='email'
							name='email'
							className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none dark:text-dark dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							required
							value={email}
							onChange={e => setEmail(e.target.value)}
							disabled={isLoading}
						/>
						<label className='absolute text-sm text-dark-500 bg-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1'>
							E-mail
						</label>
					</div>
					<div className='flex flex-col items-center '>
						<button
							type='submit'
							className='1/2 mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
							disabled={isLoading}
						>
							{isLoading ? 'Enviando...' : 'Enviar E-mail de Redefinição'}
						</button>
					</div>
				</form>
			</div>
		</section>
	);
};

export default ForgotPasswordPage;
