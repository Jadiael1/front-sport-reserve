import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import backgroundImage from '../../../assets/img/campo.jpg';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import goBack from '../../../utils/goBack';

const SignInPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const { login, user, isLoading } = useAuth();

	useEffect(() => {
		if (user && !isLoading) {
			navigate('/');
		}
	}, [user, isLoading, navigate]);

	const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await login(email, password);
			goBack(navigate);
		} catch (error) {
			setError('Credenciais inválidas. Por favor, tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<section
			className='min-h-screen flex items-center justify-center bg-cover bg-center'
			style={{ backgroundImage: `url(${backgroundImage})` }}
		>
			<div className='bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md'>
				<button
					className='flex items-center px-4 py-2 bg-transparent text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-transform transform hover:scale-105'
					onClick={() => goBack(navigate)}
				>
					<FaArrowLeft className='mr-2' />
					Voltar
				</button>
				<h1 className='text-3xl md:text-4xl font-bold my-3 text-center text-blue-700'>SportReserve</h1>
				<p className='text-sm mb-6 text-center'>Aluguel fácil, jogo garantido</p>

				<form
					onSubmit={handleSignIn}
					className='space-y-6'
				>
					<div className='relative'>
						<input
							type='email'
							name='email'
							placeholder=' '
							className={`block px-2.5 pb-2.5 pt-4 w-full text-sm ${
								loading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'text-gray-900 bg-white'
							} rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 peer`}
							required
							value={email}
							onChange={e => setEmail(e.target.value)}
							autoComplete='email'
							disabled={loading}
							aria-label='E-mail'
						/>
						<label className='absolute text-sm text-gray-500 bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4'>
							E-mail
						</label>
					</div>

					<div className='relative'>
						<input
							type={showPassword ? 'text' : 'password'}
							name='password'
							placeholder=' '
							className={`block px-2.5 pb-2.5 pt-4 w-full text-sm ${
								loading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'text-gray-900 bg-white'
							} rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 peer`}
							required
							value={password}
							onChange={e => setPassword(e.target.value)}
							autoComplete='current-password'
							disabled={loading}
							aria-label='Senha'
						/>
						<label className='absolute text-sm text-gray-500 bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4'>
							Senha
						</label>
						<button
							type='button'
							className='absolute inset-y-0 right-0 flex items-center pr-3'
							onClick={() => setShowPassword(!showPassword)}
							aria-label='Mostrar/Esconder senha'
						>
							{showPassword ?
								<FaEyeSlash className='text-gray-500' />
							:	<FaEye className='text-gray-500' />}
						</button>
					</div>

					{error && <div className='text-red-500 text-sm'>{error}</div>}

					<div className='flex items-center justify-center'>
						<button
							type='submit'
							className={`w-full flex items-center justify-center ${
								loading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
							} text-white py-3 px-4 rounded-lg transition-colors duration-300`}
							disabled={loading}
						>
							{loading ?
								<svg
									aria-hidden='true'
									className='w-6 h-6 text-white animate-spin'
									viewBox='0 0 100 101'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
										fill='currentColor'
									/>
									<path
										d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
										fill='currentFill'
									/>
								</svg>
							:	'Entrar'}
						</button>
					</div>

					<div className='flex justify-end mt-4'>
						<button
							type='button'
							className='hover:underline text-sm'
							onClick={() => navigate('/auth/forgot-password')}
						>
							Esqueceu a senha?
						</button>
					</div>

					<div className='flex items-center justify-center mt-4'>
						<p>
							Não tem uma conta?{' '}
							<a
								href=''
								className='text-blue-600 font-bold underline'
								onClick={() => navigate('/auth/signup')}
							>
								Registre-se
							</a>
						</p>
					</div>
				</form>
			</div>
		</section>
	);
};

export default SignInPage;
